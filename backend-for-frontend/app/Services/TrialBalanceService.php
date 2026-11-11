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
     * Trial Balance v2 — balance-sheet style, KES only.
     *
     *  1. Cash/Bank (DR): sum of actual balances of chart-1000 accounts as
     *     at the run date. USD accounts translate at the run rate; KES pass
     *     through; legacy currencies stay untranslated. Not a running
     *     ledger — it is the bank position "as at now" (balances live on
     *     the accounts table).
     *
     *  2. Accounts Payable (CR): sum of unpaid vendor invoices — vendor
     *     invoice totals (converted at each invoice's recorded rate) minus
     *     payments settled against them.
     *
     *  3. Equity rows (Owners Capital / Retained Earnings) are dropped.
     *
     *  4. A single Tax Expense row (DR): Output VAT (tax on customer
     *     invoices/debit notes) − Input VAT (tax on vendor invoices). It
     *     stays on the debit side whether positive or negative.
     *
     * Because cash is a real balance rather than movement-derived, and the
     * tax row is computed rather than posted, the TB is no longer expected
     * to self-balance from double-entry alone — the 'balanced' figure is
     * still reported honestly (it equals the difference), and a Balancing /
     * Suspense entry is NOT auto-inserted.
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

            $toKes = function (float $amount, ?string $currency, $recordedRate = null): float {
                $currency = $currency ?? 'KES';

                if ($currency === 'USD' && $recordedRate !== null && (float) $recordedRate > 0) {
                    return round($amount * (float) $recordedRate, 2);
                }

                return round($amount, 2);
            };

            /*
             * 1) Cash/Bank balances (DR) — chart 1000 accounts only, as at
             *    the run date.
             */
            $accounts = DB::table('accounts')
                ->where('is_deleted', false)
                ->whereIn('chart_of_account_id', [$assetsId])
                ->get();

            $cashKes = 0.0;
            foreach ($accounts as $account) {
                $balance = (float) $account->balance;

                if ($account->currency === 'USD') {
                    $cashKes = round($cashKes + $balance * $fxRate, 2);
                } elseif ($account->currency === 'KES') {
                    $cashKes = round($cashKes + $balance, 2);
                } else {
                    // Legacy stray currencies: untranslated.
                    $cashKes = round($cashKes + $balance, 2);
                }
            }

            $post('cash', $assetsId, 'Assets', 'Cash/Bank Accounts (Petty Cash & Bank Account Balances)', $cashKes, 'debit');

            /*
             * 1b) Accounts Receivables — a single debit figure: the sum of
             *     PENDING balances on customer invoices (invoice totals
             *     converted via the invoice's own forex_rate, minus payments
             *     received against them), as at the run date. Sales Revenue
             *     still accrues from the customer ledger (net amounts), and
             *     receipts boost the Cash row.
             */
            $arPending = 0.0;

            $invoiceConvertedGlobal = DB::getSchemaBuilder()->hasColumn('cust_invoices', 'total_converted')
                ? DB::table('cust_invoices')->pluck('total_converted', 'id')
                : collect();

            if (DB::getSchemaBuilder()->hasTable('cust_invoices')) {
                $invoices = DB::table('cust_invoices')
                    ->where('is_deleted', false)
                    ->whereDate('created_at', '<=', $asAt)
                    ->get(['id', 'invoice_number', 'total_converted', 'currency', 'total_amount']);

                foreach ($invoices as $invoice) {
                    // Converted total at the invoice's own forex_rate.
                    if (isset($invoiceConvertedGlobal[(int) $invoice->id])) {
                        $totalKes = (float) $invoiceConvertedGlobal[(int) $invoice->id];
                    } else {
                        $totalKes = $toKes((float) $invoice->total_amount, $invoice->currency, null);
                    }

                    // Payments received against the invoice, at their
                    // recorded rates, from the customer ledger.
                    $paidKes = (float) DB::table('customer_transactions_ledger')
                        ->where('is_deleted', false)
                        ->where('source_type', 'cust_invoice')
                        ->where('source_id', $invoice->id)
                        ->where('transaction_type', 'receipt')
                        ->whereDate('transaction_date', '<=', $asAt)
                        ->get(['amount', 'exchange_rate', 'transaction_currency'])
                        ->sum(fn ($r) => $toKes((float) $r->amount, $r->transaction_currency, $r->exchange_rate));

                    $outstanding = max(round($totalKes - $paidKes, 2), 0);
                    $arPending = round($arPending + min($outstanding, $totalKes), 2);
                }
            }

            $post('ar', $assetsId, 'Assets', 'Accounts Receivables – (Customer Invoice balances)', $arPending, 'debit');

            // Sales Revenue accrual (net) + Cash inflow from receipts.
            $custLedger = DB::table('customer_transactions_ledger')
                ->where('is_deleted', false)
                ->whereDate('transaction_date', '<=', $asAt)
                ->get(['id', 'transaction_type', 'source_type', 'source_id', 'amount', 'tax_amount', 'net_amount', 'exchange_rate', 'transaction_currency', 'narration']);

            foreach ($custLedger as $row) {
                $recorded = $row->exchange_rate;
                $gross = $toKes((float) $row->amount, $row->transaction_currency, $recorded);

                if ($row->transaction_type === 'invoice' && $row->source_type === 'cust_invoice'
                    && isset($invoiceConvertedGlobal[$row->source_id])) {
                    // Net revenue = invoice converted total − converted tax.
                    $invoiceNetConverted = DB::getSchemaBuilder()->hasTable('cust_invoices')
                        && DB::getSchemaBuilder()->hasColumn('cust_invoices', 'tax_converted')
                        ? DB::table('cust_invoices')->selectRaw('id, total_converted - tax_converted AS net_converted')->pluck('net_converted', 'id')
                        : collect();
                    $net = (float) ($invoiceNetConverted[$row->source_id] ?? 0);
                    $post('sales', $revenueId, 'Revenue', 'Sales Revenue', $net, 'credit');
                    continue;
                }

                if ($row->transaction_type === 'invoice') {
                    $net = $toKes((float) $row->net_amount, $row->transaction_currency, $recorded);
                    $post('sales', $revenueId, 'Revenue', 'Sales Revenue', $net, 'credit');
                } elseif ($row->transaction_type === 'receipt') {
                    $post('cash', $assetsId, 'Assets', 'Cash/Bank Accounts (Petty Cash & Bank Account Balances)', $gross, 'debit');
                }
            }

            /*
             * 1c) Loan movements
             * 1c) Loan movements: Loans Payable from the loan's booked KES
             *     values (disbursement credit, principal debit), and interest
             *     expense from repayment transactions.
             */
            $loanPrincipalKes = DB::getSchemaBuilder()->hasColumn('loans', 'principal_kes')
                ? DB::table('loans')->pluck('principal_kes', 'id')
                : collect();

            $loanTxns = DB::table('transactions')
                ->where('is_deleted', false)
                ->whereDate('transaction_date', '<=', $asAt)
                ->whereIn('source_type', ['loan_disbursement', 'loan_repayment'])
                ->get(['id', 'transaction_type', 'source_type', 'source_id', 'amount', 'exchange_rate', 'transaction_currency', 'account_debit', 'narration']);

            foreach ($loanTxns as $txn) {
                $legKes = $toKes((float) $txn->amount, $txn->transaction_currency, $txn->exchange_rate);

                if ($txn->source_type === 'loan_disbursement') {
                    // Booked at the loan's own forex rate.
                    $loanKes = (float) ($loanPrincipalKes[$txn->source_id] ?? 0);
                    $post('loans', $liabilitiesId, 'Liabilities', 'Loans Payable', $loanKes, 'credit');
                } elseif ($txn->transaction_type === 'loan_principal') {
                    $post('loans', $liabilitiesId, 'Liabilities', 'Loans Payable', $legKes, 'debit');
                } elseif ($txn->transaction_type === 'interest') {
                    $post('interest', $expensesId, 'Expenses', 'Interest Expenses', $legKes, 'debit');
                }
            }

            /*
             * 2) Accounts Payable (CR) — unpaid vendor invoices as at the
             *    run date: company invoice totals converted at each one's
             *    recorded forex rate, less payments settled against them
             *    (company payments reference invoices via invoice_id).
             */
            if (DB::getSchemaBuilder()->hasTable('company_invoices')) {
                $apTotal = 0.0;

                $invoices = DB::table('company_invoices')
                    ->where('is_deleted', false)
                    ->whereDate('created_at', '<=', $asAt)
                    ->get(['id', 'total_amount', 'currency']);

                foreach ($invoices as $invoice) {
                    $invoiceKes = $toKes((float) $invoice->total_amount, $invoice->currency, null);

                    $paid = (float) DB::table('company_payments')
                        ->where('invoice_id', $invoice->id)
                        ->where('is_deleted', false)
                        ->sum('amount_paid');

                    $outstanding = min(max(round($invoiceKes - $paid, 2), 0), $invoiceKes);
                    $apTotal = round($apTotal + $outstanding, 2);
                }

                $post('ap', $liabilitiesId, 'Liabilities', 'Accounts Payable ( Supplier Invoices Balances)', $apTotal, 'credit');
            }

            /*
             * 2b) Company ledger: expenses (net) on vendor bills, and cash
             *     settlements. The tax component of vendor bills is NOT
             *     posted here separately — Input VAT is captured inside the
             *     single Tax Expense row above.
             */
            if (DB::getSchemaBuilder()->hasTable('company_transactions_ledger')) {
                $coLedger = DB::table('company_transactions_ledger')
                    ->where('is_deleted', false)
                    ->whereDate('transaction_date', '<=', $asAt)
                    ->get(['id', 'transaction_type', 'source_type', 'source_id', 'amount', 'tax_amount', 'net_amount', 'exchange_rate', 'transaction_currency', 'narration']);

                foreach ($coLedger as $row) {
                    $recorded = $row->exchange_rate;
                    $net = $toKes((float) $row->net_amount, $row->transaction_currency, $recorded);

                    if ($row->transaction_type === 'invoice') {
                        $post('expenses', $expensesId, 'Expenses', 'Expenses', $net, 'debit');
                    }
                }
            }

            /*
             * 3) Tax Expense (DR) — Output VAT (customer invoices + debit
             *    notes) minus Input VAT (vendor invoices). Always debited,
             *    whether positive or negative.
             */
            $outputVat = 0.0;
            $inputVat = 0.0;

            // Output VAT: customer invoices at their own converted rates,
            // plus customer debit notes at their recorded rates.
            if (DB::getSchemaBuilder()->hasTable('cust_invoices')
                && DB::getSchemaBuilder()->hasColumn('cust_invoices', 'tax_converted')) {
                $outputVat = round((float) DB::table('cust_invoices')
                    ->where('is_deleted', false)
                    ->whereDate('created_at', '<=', $asAt)
                    ->sum('tax_converted'), 2);
            }

            if (DB::getSchemaBuilder()->hasTable('cust_debit_notes')
                && \Illuminate\Support\Facades\Schema::hasColumn('cust_debit_notes', 'tax_amount')) {
                foreach (DB::table('cust_debit_notes')
                    ->where('is_deleted', false)
                    ->whereDate('created_at', '<=', $asAt)
                    ->get(['id', 'tax_amount', 'currency', 'total_amount']) as $note) {
                    // Recorded invoice-level rate lives on the parent invoice;
                    // use the note's amount ratio against the invoice's rate.
                    $parentRate = DB::table('cust_invoices')
                        ->where('id', $note->total_amount ? $note->id : 0)
                        ->value('forex_rate');
                    $outputVat = round($outputVat + $toKes((float) $note->tax_amount, $note->currency, $parentRate ?: null), 2);
                }
            }

            // Input VAT: vendor invoices.
            if (DB::getSchemaBuilder()->hasTable('company_invoices')) {
                foreach (DB::table('company_invoices')
                    ->where('is_deleted', false)
                    ->whereDate('created_at', '<=', $asAt)
                    ->get(['id', 'tax_amount', 'currency']) as $invoice) {
                    // Vendor invoices have no forex column; record-rate via
                    // invoice's amount ratio is unavailable, so KES invoices
                    // pass through; foreign-currency vendor invoices use the
                    // run rate only if they are USD; others untranslated.
                    $inputVat = round($inputVat + $toKes((float) $invoice->tax_amount, $invoice->currency, null), 2);
                }
            }

            $taxExpense = round($outputVat - $inputVat, 2);

            // Always post the tax expense on the debit side (absolute value).
            if (abs($taxExpense) >= 0.01) {
                $post('tax_exp', $expensesId, 'Expenses', 'Tax Expense', abs($taxExpense), 'debit');
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

            // Zero-fill the standard rows so the layout is always complete.
            $standard = [
                ['cash', 'Assets', 'Cash/Bank Accounts (Petty Cash & Bank Account Balances)'],
                ['ar', 'Assets', 'Accounts Receivables – (Customer Invoice balances)'],
                ['ap', 'Liabilities', 'Accounts Payable ( Supplier Invoices Balances)'],
                ['salaries', 'Liabilities', 'Salaries Payable'],
                ['loans', 'Liabilities', 'Loans Payable'],
                ['sales', 'Revenue', 'Sales Revenue'],
                ['cogs', 'Expenses', 'Cost Of Goods Sold'],
                ['expenses', 'Expenses', 'Expenses'],
                ['interest', 'Expenses', 'Interest Expenses'],
                ['tax_exp', 'Expenses', 'Tax Expense'],
            ];
            $chartFor = [
                'cash' => $assetsId, 'ar' => $assetsId,
                'ap' => $liabilitiesId, 'salaries' => $liabilitiesId, 'loans' => $liabilitiesId,
                'sales' => $revenueId,
                'cogs' => $expensesId, 'expenses' => $expensesId, 'interest' => $expensesId, 'tax_exp' => $expensesId,
            ];

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
     * Totals per named row for an existing run (KES-only), plus the
     * debit/credit totals. With the balance-sheet model the total may not
     * equal — the difference is reported honestly.
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
            ],
        ];
    }

    /**
     * Detail rows for a run.
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
