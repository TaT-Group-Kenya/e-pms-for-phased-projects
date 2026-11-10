<?php

namespace App\Services;

use App\Models\ChartOfAccount;
use App\Models\TrialBalanceRun;
use Illuminate\Support\Facades\DB;

class TrialBalanceService
{
    /**
     * Generate a trial-balance snapshot as of a date, translated at a
     * user-entered USD->KES rate. Immutable once stored: reruns create a
     * new snapshot so history stays auditable.
     *
     * Double-entry model — every posting produces TWO lines (one debit,
     * one credit) so total debits always equal total credits:
     *
     *  transactions table (cash/loan/expense movements):
     *    topup                DEBIT asset 1000 (cash in) | CREDIT 3000 equity
     *      - loan_disbursement counterpart:            | CREDIT 2000 loan
     *      - internal transfer: DEBIT target 1000       | CREDIT source 1000
     *    expense/interest     CREDIT asset 1000 (cash out) | DEBIT 5000
     *    loan_principal       CREDIT asset 1000            | DEBIT 2000
     *
     *  customer ledger (sales accrual):
     *    invoice postings     CREDIT 4000 revenue          | DEBIT 1000 AR
     *    receipt postings     DEBIT 1000 cash in           | CREDIT 1000 AR
     *
     *  company ledger (purchases accrual):
     *    invoice postings     DEBIT 5000 expense           | CREDIT 2000 AP
     *    payment postings     DEBIT 2000 AP                | CREDIT 1000 cash
     *
     *  tax ledger:
     *    collected (2000)     CREDIT 2000                  | DEBIT 1000 tax recoverable
     *    paid (1000)          DEBIT 1000                   | CREDIT 2000
     *
     * Loan outstanding, tax position and AR/AP balances are emergent from
     * these legs — no separate valuation lines, no double counting.
     *
     * @param  array{as_at_date: string, forex_rate: float|int|string, created_by?: ?int}  $data
    /**
     * FX policy (KES-only output):
     *  1. KES rows pass through unchanged (already base currency).
     *  2. Rows with a recorded exchange_rate (captured at transaction time)
     *     use that rate — today's rate is never applied to the past.
     *  3. The user-entered run rate applies ONLY to USD bank account
     *     balances as at the run date (balance-sheet items: "what is this
     *     USD cash worth today").
     *  4. Any other legacy currency is left untranslated rather than
     *     mis-converted at the USD rate.
     *
     * The books derive from postings; bank balances EMERGE from the posting
     * legs (topups in, expenses/repayments out), so every posting produces
     * both its debit and credit side and the TB balances by construction.
     *
     * @param  array{as_at_date: string, forex_rate: float|int|string, created_by?: ?int}  $data
     */
    public function generate(array $data): TrialBalanceRun
    {
        return DB::transaction(function () use ($data) {
            $asAt = $data['as_at_date'];
            $fxRate = (float) $data['forex_rate'];

            if ($fxRate <= 0) {
                throw new \InvalidArgumentException('Forex rate (USD to KES) must be greater than zero.');
            }

            $charts = ChartOfAccount::all()->keyBy('code');
            $assetsId = (int) ($charts['1000']->id ?? 0);
            $liabilitiesId = (int) ($charts['2000']->id ?? 0);
            $equityId = (int) ($charts['3000']->id ?? 0);
            $revenueId = (int) ($charts['4000']->id ?? 0);
            $expensesId = (int) ($charts['5000']->id ?? 0);

            $run = TrialBalanceRun::create([
                'run_number' => (new CommonService)->generateUniqueCode('TB-'),
                'as_at_date' => $asAt,
                'forex_rate' => $fxRate,
                'base_currency' => 'KES',
                'created_by' => $data['created_by'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $buckets = [];
            $post = function (string $key, int $chartId, string $category, string $name, float $amountKes, string $side) use (&$buckets) {
                if (round($amountKes, 2) <= 0) {
                    return;
                }
                if (! isset($buckets[$key])) {
                    $buckets[$key] = ['chart_id' => $chartId, 'category' => $category, 'name' => $name, 'debit' => 0.0, 'credit' => 0.0];
                }
                if ($side === 'debit') {
                    $buckets[$key]['debit'] = round($buckets[$key]['debit'] + $amountKes, 2);
                } else {
                    $buckets[$key]['credit'] = round($buckets[$key]['credit'] + $amountKes, 2);
                }
            };

            $accountById = DB::table('accounts')->get()->keyBy('id');

            /*
             * Row-level KES resolution (see policy above).
             * allowRunRate=true marks rows whose value as at the run date
             * matters (balance-sheet items) rather than historical amounts.
             */
            $toKes = function (float $amount, ?string $currency, $recordedRate = null, bool $allowRunRate = false) use ($fxRate): float {
                $amount = (float) $amount;
                $currency = $currency ?? 'KES';

                if ($currency === 'KES') {
                    return round($amount, 2);
                }

                if ($currency === 'USD') {
                    if ($recordedRate !== null && (float) $recordedRate > 0) {
                        return round($amount * (float) $recordedRate, 2);
                    }
                    if ($allowRunRate) {
                        return round($amount * $fxRate, 2);
                    }

                    return round($amount, 2);
                }

                return round($amount, 2);
            };

            /*
             * 1) Cash movement legs from the transactions table establish
             *    the bank balances + their counterparts (equity for initial
             *    balances/external topups, loan payable for disbursements,
             *    expense/principal/interest for outflows).
             *
             *    The cash side of a USD-denominated movement uses the run
             *    rate ONLY where the row is a balance-forming topup without
             *    its own recorded translation (initial balances); all other
             *    rows use their recorded rate.
             */
            $accountByIdArray = $accountById;
            // Loan KES equivalents (booked at the loan's own forex rate) —
            // authoritative for the trial balance, never re-translated.
            $loanPrincipalKes = DB::getSchemaBuilder()->hasColumn('loans', 'principal_kes')
                ? DB::table('loans')->pluck('principal_kes', 'id')
                : collect();

            $txns = DB::table('transactions')
                ->where('is_deleted', false)
                ->whereDate('transaction_date', '<=', $asAt)
                ->get(['id', 'transaction_type', 'source_type', 'source_id', 'amount', 'exchange_rate', 'converted_amount', 'transaction_currency', 'account_debit', 'account_credit', 'narration']);

            foreach ($txns as $txn) {
                $narration = $txn->narration ?? '';
                $debitAccountId = $txn->account_debit ? (int) $txn->account_debit : null;
                $creditAccountId = $txn->account_credit ? (int) $txn->account_credit : null;
                $debitAccount = $debitAccountId ? ($accountByIdArray[$debitAccountId] ?? null) : null;
                $creditAccount = $creditAccountId ? ($accountByIdArray[$creditAccountId] ?? null) : null;

                if ($txn->transaction_type === 'topup') {
                    /*
                     * Rates per leg (never mixed within a posting — the
                     * balancing difference flows into Retained Earnings):
                     *  - Cash in: a USD bank balance sheet item → the run
                     *    rate applies (what this USD cash is worth today)
                     *    unless the row carries its own recorded rate.
                     *  - Counterpart: for loan disbursements the amount comes
                     *    from the loan's principal_kes (booked at the loan's
                     *    own forex rate); for initial balances / external
                     *    topups the recorded rate (or untranslated legacy) applies.
                     */
                    // Rate for the cash leg follows the RECEIVING account's
                    // currency (bank balance at that currency), except loan
                    // disbursements which use the loan's booked KES amount
                    // (principal_kes) so cash and Loans Payable always agree.
                    if ($txn->source_type === 'loan_disbursement') {
                        $cashKes = (float) ($loanPrincipalKes[$txn->source_id] ?? 0);
                    } else {
                        $receivingCurrency = $creditAccount?->currency ?? ($txn->transaction_currency ?? 'KES');
                        $cashKes = $toKes((float) $txn->amount, $receivingCurrency, $txn->source_type === 'account_initial_balance' ? null : $txn->exchange_rate, true);
                    }

                    if ($creditAccountId && $creditAccount) {
                        $post('cash', $assetsId, 'Assets', 'Cash/Bank Accounts (Petty Cash & Bank Account Balances)', $cashKes, 'debit');
                    }

                    // Counterpart.
                    if ($debitAccountId && $debitAccount) {
                        // Internal transfer: one asset account funds another.
                        $post('cash', $assetsId, 'Assets', 'Cash/Bank Accounts (Petty Cash & Bank Account Balances)', $cashKes, 'credit');
                    } elseif ($txn->source_type === 'loan_disbursement') {
                        // Booked at the loan's own forex rate.
                        $loanKes = (float) ($loanPrincipalKes[$txn->source_id] ?? 0);
                        $post('loans', $liabilitiesId, 'Liabilities', 'Loans Payable', $loanKes, 'credit');
                    } else {
                        // Initial balance / external top-up: owner contribution.
                        $post('capital', $equityId, 'Equity', 'Owners Capital', $cashKes, 'credit');
                    }
                } elseif (in_array($txn->transaction_type, ['expense', 'interest', 'loan_principal'], true)) {
                    // Cash leaves: the paying account is credited (decrease).
                    // Loan repayment/interest/principal rows carry the loan's
                    // fx rate in their recorded exchange_rate (set at
                    // repayment time), so this resolves to the true booked
                    // KES amounts — not today's rate, not a placeholder.
                    $legKes = $toKes((float) $txn->amount, $txn->transaction_currency, $txn->exchange_rate, false);

                    if ($debitAccountId) {
                        $post('cash', $assetsId, 'Assets', 'Cash/Bank Accounts (Petty Cash & Bank Account Balances)', $legKes, 'credit');
                    }

                    if ($txn->transaction_type === 'loan_principal') {
                        $post('loans', $liabilitiesId, 'Liabilities', 'Loans Payable', $legKes, 'debit');
                    } elseif ($txn->transaction_type === 'interest') {
                        $post('interest', $expensesId, 'Expenses', 'Interest Expenses', $legKes, 'debit');
                    } else {
                        $post('expenses', $expensesId, 'Expenses', 'Expenses', $legKes, 'debit');
                    }
                }
            }

            // 2) Customer ledger: sales accrual + receipts. Invoice rows
            //    translate through the invoice's own forex_rate and
            //    converted columns (recorded on the invoice); receipt rows
            //    use their recorded rate.
            $custLedger = DB::table('customer_transactions_ledger')
                ->where('is_deleted', false)
                ->whereDate('transaction_date', '<=', $asAt)
                ->get(['id', 'transaction_type', 'source_type', 'source_id', 'amount', 'tax_amount', 'net_amount', 'exchange_rate', 'transaction_currency', 'narration']);

            // Invoice converted amounts, keyed by invoice id for lookup.
            $invoiceConverted = DB::table('cust_invoices')
                ->pluck('total_converted', 'id');
            $invoiceNetConverted = DB::table('cust_invoices')
                ->selectRaw('id, total_converted - tax_converted AS net_converted')
                ->pluck('net_converted', 'id');
            $invoiceTaxConverted = DB::table('cust_invoices')
                ->pluck('tax_converted', 'id');

            foreach ($custLedger as $row) {
                $recorded = $row->exchange_rate;

                if ($row->transaction_type === 'invoice' && $row->source_type === 'cust_invoice'
                    && isset($invoiceConverted[$row->source_id])) {
                    // Use the invoice's stored converted values.
                    $gross = (float) $invoiceConverted[$row->source_id];
                    $net = (float) ($invoiceNetConverted[$row->source_id] ?? 0);
                    $tax = (float) ($invoiceTaxConverted[$row->source_id] ?? 0);
                } else {
                    $gross = $toKes((float) $row->amount, $row->transaction_currency, $recorded, false);
                    $net = $toKes((float) $row->net_amount, $row->transaction_currency, $recorded, false);
                    $tax = $toKes((float) $row->tax_amount, $row->transaction_currency, $recorded, false);
                }

                if ($row->transaction_type === 'invoice') {
                    $post('sales', $revenueId, 'Revenue', 'Sales Revenue', $net, 'credit');
                    $post('ar', $assetsId, 'Assets', 'Accounts Receivables – (Customer Invoice balances)', $gross, 'debit');
                    if ($tax > 0) {
                        // Full invoice tax credit; the tax ledger's DR/CR
                        // rows (section 4) determine how it splits into
                        // collected vs uncollected.
                        $post('tax_full', $liabilitiesId, 'Liabilities', 'Tax Payable', $tax, 'credit');
                    }
                } elseif ($row->transaction_type === 'receipt') {
                    // Customer paid: AR settled (credit) and the cash landed
                    // on the receiving account (debit) at the same recorded
                    // rate — the cash balance emerges here too.
                    $post('ar', $assetsId, 'Assets', 'Accounts Receivables – (Customer Invoice balances)', $gross, 'credit');
                    $post('cash', $assetsId, 'Assets', 'Cash/Bank Accounts (Petty Cash & Bank Account Balances)', $gross, 'debit');
                }
            }

            // 3) Company ledger: vendor accrual + settlements.
            $coLedger = DB::table('company_transactions_ledger')
                ->where('is_deleted', false)
                ->whereDate('transaction_date', '<=', $asAt)
                ->get(['id', 'transaction_type', 'source_type', 'source_id', 'amount', 'tax_amount', 'net_amount', 'exchange_rate', 'transaction_currency', 'narration']);

            foreach ($coLedger as $row) {
                $recorded = $row->exchange_rate;
                $gross = $toKes((float) $row->amount, $row->transaction_currency, $recorded, false);
                $net = $toKes((float) $row->net_amount, $row->transaction_currency, $recorded, false);
                $tax = $toKes((float) $row->tax_amount, $row->transaction_currency, $recorded, false);

                if ($row->transaction_type === 'invoice') {
                    $post('expenses', $expensesId, 'Expenses', 'Expenses', $net, 'debit');
                    $post('ap', $liabilitiesId, 'Liabilities', 'Accounts Payable ( Supplier Invoices Balances)', $gross, 'credit');
                    if ($tax > 0) {
                        // Full vendor-invoice tax debited; split later via the
                        // tax ledger DR/CR into realized vs pending.
                        $post('tax_full_paid', $assetsId, 'Assets', 'Tax Receivable', $tax, 'debit');
                    }
                } elseif ($row->transaction_type === 'payment') {
                    $post('ap', $liabilitiesId, 'Liabilities', 'Accounts Payable ( Supplier Invoices Balances)', $gross, 'debit');
                    $post('cash', $assetsId, 'Assets', 'Cash/Bank Accounts (Petty Cash & Bank Account Balances)', $gross, 'credit');
                }
            }

            // 4) Tax ledger DR/CR: split the full tax bucket into
            //    collected (CR movements) and uncollected (DR − CR).
            //
            //    The customer-ledger entries above credit the FULL tax into
            //    the 'tax_full' bucket; here the tax ledger decides how much
            //    of it has been collected so far. Amounts balance by
            //    construction: collected + uncollected == full tax.
            if (DB::getSchemaBuilder()->hasTable('tax_transactions')
                && \Illuminate\Support\Facades\Schema::hasColumn('tax_transactions', 'side')) {
                $taxBuckets = \App\Services\TaxTransactionService::documentBuckets($asAt);

                // The customer/company ledger entries above credited/debited
                // the FULL tax into these buckets. Here the split rows below
                // REPLACE that full amount: remove it first, then only the
                // collected + uncollected rows carry the tax in the TB.
                foreach ($taxBuckets as $bucket) {
                    $isCustomerSide = in_array($bucket['source_type'], ['cust_invoice', 'customer_debit_note'], true);
                    $key = $isCustomerSide ? 'tax_full' : 'tax_full_paid';

                    if (isset($buckets[$key])) {
                        // Subtract only from the side the full tax was
                        // posted to: credit for customer-side (payable),
                        // debit for company-side (recoverable).
                        $side = $isCustomerSide ? 'credit' : 'debit';
                        $buckets[$key][$side] = round($buckets[$key][$side] - $bucket['tax_opened'], 2);
                    }
                }

                foreach ($taxBuckets as $bucket) {
                    $isCustomerSide = in_array($bucket['source_type'], ['cust_invoice', 'customer_debit_note'], true);

                    if ($bucket['tax_collected'] > 0) {
                        $post(
                            'tax_collected',
                            $isCustomerSide ? $liabilitiesId : $assetsId,
                            $isCustomerSide ? 'Liabilities' : 'Assets',
                            $isCustomerSide ? 'Tax Payable (collected)' : 'Tax Recoverable (realized)',
                            $bucket['tax_collected'],
                            $isCustomerSide ? 'credit' : 'debit'
                        );
                    }

                    if ($bucket['tax_uncollected'] > 0) {
                        $post(
                            'tax_uncollected',
                            $isCustomerSide ? $liabilitiesId : $assetsId,
                            $isCustomerSide ? 'Liabilities' : 'Assets',
                            $isCustomerSide ? 'Tax Payable (uncollected)' : 'Tax Recoverable (pending)',
                            $bucket['tax_uncollected'],
                            $isCustomerSide ? 'credit' : 'debit'
                        );
                    }
                }
            }

            /*
             * 5) Opening Balance Adjustment (booked to Retained Earnings).
             *
             * Bank account balances are authoritative: they include pre-system
             * openings that were never posted as transactions. The generator
             * derives cash from postings only, so the difference between real
             * balances and posted cash is the unrecorded opening — posted here
             * as an explicit, honest adjustment (Cash correction + identical
             * Retained Earnings entry). On books where every dollar has a
             * journal entry this is zero.
             */
            $cashPosted = round(($buckets['cash']['debit'] ?? 0) - ($buckets['cash']['credit'] ?? 0), 2);

            $cashReal = 0.0;
            foreach ($accountById as $account) {
                if ((bool) ($account->is_deleted ?? false)) {
                    continue;
                }
                $cashReal = round($cashReal + $toKes((float) $account->balance, $account->currency, null, true), 2);
            }

            $cashGap = round($cashReal - $cashPosted, 2);
            if (abs($cashGap) >= 0.01) {
                // (a) Bring Cash to the true position.
                $post(
                    'cash',
                    $assetsId,
                    'Assets',
                    'Cash/Bank Accounts (Petty Cash & Bank Account Balances)',
                    abs($cashGap),
                    $cashGap > 0 ? 'debit' : 'credit'
                );

                // (b) Identical amount to Retained Earnings (opposite side).
                $post(
                    'retained',
                    $equityId,
                    'Equity',
                    'Retained Earnings',
                    abs($cashGap),
                    $cashGap > 0 ? 'credit' : 'debit'
                );
            }

            $lines = [];
            foreach ($buckets as $key => $b) {
                $lines[] = [
                    'trial_balance_run_id' => $run->id,
                    'chart_of_account' => $b['chart_id'],
                    'category' => $b['category'],
                    'source_table' => 'tb:'.$key,
                    'source_type' => null,
                    'source_id' => null,
                    'account_id' => null,
                    'debit_kes' => $b['debit'],
                    'credit_kes' => $b['credit'],
                    'debit_usd' => 0,
                    'credit_usd' => 0,
                    'description' => $b['name'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // Zero-fill untouched standard rows so the legal layout is whole.
            $standard = [
                ['cash', 'Assets', 'Cash/Bank Accounts (Petty Cash & Bank Account Balances)'],
                ['ar', 'Assets', 'Accounts Receivables – (Customer Invoice balances)'],
                ['tax_paid', 'Assets', 'Tax Receivable (paid)'],
                ['tax_full_paid', 'Assets', 'Tax Receivable'],
                ['tax_uncollected', 'Liabilities', 'Tax Payable (uncollected)'],
                ['ap', 'Liabilities', 'Accounts Payable ( Supplier Invoices Balances)'],
                ['salaries', 'Liabilities', 'Salaries Payable'],
                ['loans', 'Liabilities', 'Loans Payable'],
                ['tax_collected', 'Liabilities', 'Tax Payable (collected)'],
                ['capital', 'Equity', 'Owners Capital'],
                ['retained', 'Equity', 'Retained Earnings'],
                ['sales', 'Revenue', 'Sales Revenue'],
                ['cogs', 'Expenses', 'Cost Of Goods Sold'],
                ['expenses', 'Expenses', 'Expenses'],
                ['interest', 'Expenses', 'Interest Expenses'],
                ['tax_exp', 'Expenses', 'Tax Expenses'],
            ];
            $chartFor = ['cash' => $assetsId, 'ar' => $assetsId, 'tax_paid' => $assetsId, 'tax_full_paid' => $assetsId, 'ap' => $liabilitiesId, 'salaries' => $liabilitiesId, 'loans' => $liabilitiesId, 'tax_collected' => $liabilitiesId, 'tax_uncollected' => $liabilitiesId, 'capital' => $equityId, 'retained' => $equityId, 'sales' => $revenueId, 'cogs' => $expensesId, 'expenses' => $expensesId, 'interest' => $expensesId, 'tax_exp' => $expensesId];

            foreach ($standard as [$key, $category, $name]) {
                if (isset($buckets[$key])) {
                    continue;
                }
                $lines[] = [
                    'trial_balance_run_id' => $run->id,
                    'chart_of_account' => $chartFor[$key] ?? 0,
                    'category' => $category,
                    'source_table' => 'tb:'.$key,
                    'source_type' => null,
                    'source_id' => null,
                    'account_id' => null,
                    'debit_kes' => 0,
                    'credit_kes' => 0,
                    'debit_usd' => 0,
                    'credit_usd' => 0,
                    'description' => $name,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            foreach (array_chunk($lines, 500) as $chunk) {
                DB::table('trial_balance_run_lines')->insert($chunk);
            }

            return $run->fresh(['lines']);
        });
    }

    /**
     * Totals per named row for an existing run (KES-only) plus the
     * balancing check.
     */
    public function present(TrialBalanceRun $run): array
    {
        $lines = $run->lines()
            ->join('chart_of_accounts as c', 'c.id', '=', 'trial_balance_run_lines.chart_of_account')
            ->selectRaw('
                trial_balance_run_lines.id,
                trial_balance_run_lines.chart_of_account,
                c.code AS chart_code,
                trial_balance_run_lines.category,
                trial_balance_run_lines.description AS account_name,
                SUM(debit_kes) AS debit_kes,
                SUM(credit_kes) AS credit_kes
            ')
            ->groupBy('trial_balance_run_lines.id', 'trial_balance_run_lines.chart_of_account', 'chart_code', 'trial_balance_run_lines.category', 'account_name')
            ->orderBy('chart_code')
            ->orderBy('account_name')
            ->get();

        $totalDebitKes = (float) $lines->sum('debit_kes');
        $totalCreditKes = (float) $lines->sum('credit_kes');

        return [
            'run' => [
                'id' => $run->id,
                'run_number' => $run->run_number,
                'as_at_date' => $run->as_at_date?->toDateString(),
                'forex_rate' => (float) $run->forex_rate,
                'base_currency' => $run->base_currency,
                'created_at' => $run->created_at?->toDateTimeString(),
            ],
            'lines' => $lines->map(fn ($row) => [
                'id' => (int) $row->id,
                'chart_of_account' => (int) $row->chart_of_account,
                'chart_code' => $row->chart_code,
                'account_name' => $row->account_name,
                'category' => $row->category,
                'debit_kes' => (float) $row->debit_kes,
                'credit_kes' => (float) $row->credit_kes,
            ]),
            'totals' => [
                'debit_kes' => $totalDebitKes,
                'credit_kes' => $totalCreditKes,
                'balanced' => abs($totalDebitKes - $totalCreditKes) < 0.01,
            ],
        ];
    }

    /**
     * Detail rows (source-legal) for a run.
     */
    public function detailLines(TrialBalanceRun $run): array
    {
        return $run->lines()
            ->join('chart_of_accounts as c', 'c.id', '=', 'trial_balance_run_lines.chart_of_account')
            ->selectRaw('
                trial_balance_run_lines.*,
                c.code AS chart_code,
                c.name AS chart_name
            ')
            ->orderBy('chart_code')
            ->orderBy('description')
            ->get()
            ->map(fn ($row) => [
                'id' => (int) $row->id,
                'chart_code' => $row->chart_code,
                'chart_name' => $row->chart_name,
                'category' => $row->category,
                'account_name' => $row->description,
                'debit_kes' => (float) $row->debit_kes,
                'credit_kes' => (float) $row->credit_kes,
            ]);
    }
}
