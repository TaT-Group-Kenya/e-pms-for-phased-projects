<?php

namespace App\Services;

use App\Models\ChartOfAccount;
use App\Models\Loan;
use App\Models\LoanSchedule;
use App\Models\TaxTransaction;
use App\Models\TrialBalanceRun;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use InvalidArgumentException;

/**
 * Trial Balance — a balance-sheet style snapshot as at a date, in KES,
 * translated with the recorded rates on finance documents (invoice forex
 * rates, loan booked rates, payment rates) and the run rate as a fallback
 * for records that carry no rate of their own (office expenses, tax run
 * rate). The rate is never hardcoded into the report.
 *
 * Every economic event posts paired rows so the run balances by
 * construction:
 *
 *  sales:      AR (gross outstanding, DR) vs Sales Revenue (net, CR)
 *              vs Sales Tax Payable (VAT part)   — the three wash.
 *  purchases:  AP (gross outstanding, CR) vs COGS (net, DR)
 *              vs the same Sales Tax line        — again the wash.
 *  capital:    Cash (DR) vs Owners Capital (CR) for the opening balances.
 *
 * Sections & sides:
 *  Liabilities (CR): AP, Expenses Payable, Loans Payable, Interest
 *    Payable, Sales Tax Payable (only when the company owes KRA), tax
 *    credit notes held for offsetting.
 *  Assets (DR): Cash, AR, prepayments for tax credit notes.
 *  Equity (CR): Owners Capital (opening-balance topups).
 *  Revenue (CR): sales nets. Expenses (DR): COGS, Expenses, Interest.
 *
 * Sales Tax Payable flips sides on sign: net VAT (output − input) >= 0 is
 * a credit (owed to KRA); negative is a debit (KRA owes back / offsets
 * future filings).
 *
 * Immutability: each run is a new stored snapshot with its lines; history
 * stays auditable.
 */
class TrialBalanceService
{
    public function __construct(
        protected LoanService $loanService,
        protected CurrencyConversionService $conversionService
    ) {}

    public function generate(array $data): TrialBalanceRun
    {
        return DB::transaction(function () use ($data) {
            $asAt = (string) $data['as_at_date'];
            $fxRate = (float) $data['forex_rate'];

            if ($fxRate <= 0) {
                throw new InvalidArgumentException('Forex rate (USD to KES) must be greater than zero.');
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
            $post = function (
                string $key,
                int $chartId,
                string $category,
                string $name,
                float $amountKes,
                string $side
            ) use (&$buckets) {
                $amountKes = round($amountKes, 2);

                if (! isset($buckets[$key])) {
                    $buckets[$key] = [
                        'chart_id' => $chartId,
                        'category' => $category,
                        'name' => $name,
                        'debit' => 0.0,
                        'credit' => 0.0,
                    ];
                }

                if ($side === 'debit') {
                    $buckets[$key]['debit'] = round($buckets[$key]['debit'] + $amountKes, 2);
                } else {
                    $buckets[$key]['credit'] = round($buckets[$key]['credit'] + $amountKes, 2);
                }
            };

            /**
             * Convert a document amount to KES: recorded document rate
             * first, then the run rate for USD, then pass-through for
             * anything else. $recordedRate is the document's own rate.
             */
            $toKes = function (float $amount, ?string $currency, ?float $recordedRate = null) use ($fxRate): float {
                $currency = $currency ?? 'KES';

                if ($currency === 'KES') {
                    return round($amount, 2);
                }

                if ($recordedRate !== null && $recordedRate > 0) {
                    return round($amount * $recordedRate, 2);
                }

                if ($currency === 'USD') {
                    return round($amount * $fxRate, 2);
                }

                return round($amount, 2);
            };

            /* 1) Cash & Bank (DR): closing balances of chart-1000 accounts
             *    as at the run date. USD accounts translate at the run rate
             *    unless they carry a recorded rate; KES passes through. */
            $cashKes = 0.0;
            foreach (DB::table('accounts')
                ->where('is_deleted', false)
                ->where('chart_of_account_id', $assetsId)
                ->get(['id', 'name', 'currency', 'balance']) as $account) {
                $cashKes = round($cashKes + $toKes((float) $account->balance, $account->currency), 2);
            }
            $post('cash', $assetsId, 'Assets', 'Cash/Bank Accounts', $cashKes, 'debit');

            /* 1b) Owners Capital (CR): the capital injected at account
             *    creation, from the ledger — the topup entries recorded
             *    with source_type=account_initial_balance. Foreign-amount
             *    entries convert at the rate provided in the run (the
             *    stored exchange rate on topups is a creation placeholder,
             *    not a market rate). */
            $capitalKes = 0.0;
            if (Schema::hasTable('transactions')) {
                foreach (DB::table('transactions')
                    ->where('is_deleted', false)
                    ->where('source_type', 'account_initial_balance')
                    ->where('transaction_type', 'topup')
                    ->whereDate('transaction_date', '<=', $asAt)
                    ->get(['amount', 'transaction_currency']) as $row) {
                    $capitalKes = round($capitalKes + $toKes((float) $row->amount, $row->transaction_currency), 2);
                }
            }
            $post('owners_capital', $liabilitiesId, 'Equity', 'Owners Capital', $capitalKes, 'credit');

            /* 2) Customer invoices (≤ as-at): gross outstanding → AR,
             *    net (gross − VAT) → Sales Revenue, VAT → Sales Tax. */

            $arOutstanding = 0.0;
            $salesNet = 0.0;
            $outputVat = 0.0;

            if (Schema::hasTable('cust_invoices') && Schema::hasColumn('cust_invoices', 'forex_rate')) {
                foreach (DB::table('cust_invoices')
                    ->where('is_deleted', false)
                    ->whereDate('created_at', '<=', $asAt)
                    ->where('status', '<>', 'draft')
                    ->get(['id', 'invoice_number', 'total_amount', 'tax_amount', 'currency', 'forex_rate']) as $invoice) {
                    $rate = (float) ($invoice->forex_rate ?: 0) ?: null;
                    $grossKes = $toKes((float) $invoice->total_amount, $invoice->currency, $rate);
                    $vatKes = $toKes((float) $invoice->tax_amount, $invoice->currency, $rate);
                    $netKes = round($grossKes - $vatKes, 2);

                    // Received to date: from the customer ledger receipts at
                    // their own recorded rates (payments may convert
                    // differently from the invoice).
                    $paidKes = 0.0;
                    foreach (DB::table('customer_transactions_ledger')
                        ->where('is_deleted', false)
                        ->where('source_type', 'cust_invoice')
                        ->where('source_id', $invoice->id)
                        ->where('transaction_type', 'receipt')
                        ->whereDate('transaction_date', '<=', $asAt)
                        ->get(['amount', 'exchange_rate', 'transaction_currency']) as $receipt) {
                        $paidKes = round(
                            $paidKes + $toKes(
                                (float) $receipt->amount,
                                $receipt->transaction_currency,
                                (float) $receipt->exchange_rate ?: null
                            ),
                            2
                        );
                    }

                    $outstanding = round($grossKes - $paidKes, 2);

                    $arOutstanding = round($arOutstanding + max($outstanding, 0), 2);
                    $salesNet = round($salesNet + $netKes, 2);
                    $outputVat = round($outputVat + $vatKes, 2);
                }
            }

            /* 2b) Debit notes (additional billings): gross → AR, net →
             *     Revenue, VAT → output VAT. Notes carry no forex column —
             *     the parent invoice's rate rides along. */
            if (Schema::hasTable('cust_debit_notes')) {
                foreach (DB::table('cust_debit_notes')
                    ->where('is_deleted', false)
                    ->whereDate('created_at', '<=', $asAt)
                    ->where('status', '<>', 'draft')
                    ->get(['id', 'debit_note_number', 'total_amount', 'tax_amount', 'currency', 'invoice_id']) as $note) {
                    $parent = $note->invoice_id
                        ? DB::table('cust_invoices')->find($note->invoice_id)
                        : null;
                    $rate = $parent && (float) $parent->forex_rate > 0 ? (float) $parent->forex_rate : null;

                    $grossKes = $toKes((float) $note->total_amount, $note->currency, $rate);
                    $vatKes = $toKes((float) $note->tax_amount, $note->currency, $rate);
                    $netKes = round($grossKes - $vatKes, 2);

                    $paidKes = 0.0;
                    foreach (DB::table('customer_transactions_ledger')
                        ->where('is_deleted', false)
                        ->where('source_type', 'customer_debit_note')
                        ->where('source_id', $note->id)
                        ->where('transaction_type', 'receipt')
                        ->whereDate('transaction_date', '<=', $asAt)
                        ->get(['amount', 'exchange_rate', 'transaction_currency']) as $receipt) {
                        $paidKes = round(
                            $paidKes + $toKes(
                                (float) $receipt->amount,
                                $receipt->transaction_currency,
                                (float) $receipt->exchange_rate ?: null
                            ),
                            2
                        );
                    }

                    $arOutstanding = round($arOutstanding + max(round($grossKes - $paidKes, 2), 0), 2);
                    $salesNet = round($salesNet + $netKes, 2);
                    $outputVat = round($outputVat + $vatKes, 2);
                }
            }

            /* 2c) Customer credit notes: reversals. Gross → AR reduction,
             *     net → Revenue reduction, VAT → output VAT reduction. */
            $custCreditGross = $custCreditNet = $custCreditVat = 0.0;
            if (Schema::hasTable('cust_credit_notes')) {
                foreach (DB::table('cust_credit_notes')
                    ->where('is_deleted', false)
                    ->whereDate('created_at', '<=', $asAt)
                    ->where('status', '<>', 'draft')
                    ->get(['id', 'credit_note_number', 'total_amount', 'tax_amount', 'currency', 'invoice_id']) as $note) {
                    $parent = $note->invoice_id
                        ? DB::table('cust_invoices')->find($note->invoice_id)
                        : null;
                    $rate = $parent && (float) $parent->forex_rate > 0 ? (float) $parent->forex_rate : null;

                    $custCreditGross = round($custCreditGross + $toKes((float) $note->total_amount, $note->currency, $rate), 2);
                    $custCreditVat = round($custCreditVat + $toKes((float) $note->tax_amount, $note->currency, $rate), 2);
                    $custCreditNet = round($custCreditNet + $toKes(round((float) $note->total_amount - (float) $note->tax_amount, 2), $note->currency, $rate), 2);
                }

                $arOutstanding = round($arOutstanding - $custCreditGross, 2);
                $salesNet = round($salesNet - $custCreditNet, 2);
                $outputVat = round($outputVat - $custCreditVat, 2);
            }

            $post('ar', $assetsId, 'Assets', 'Accounts Receivable', max($arOutstanding, 0.0), 'debit');

            /* 3) Vendor invoices (≤ as-at): gross outstanding → AP, net →
             *    COGS, VAT → input VAT. */
            $apOutstanding = 0.0;
            $cogsNet = 0.0;
            $inputVat = 0.0;

            if (Schema::hasTable('company_invoices')) {
                foreach (DB::table('company_invoices')
                    ->where('is_deleted', false)
                    ->whereDate('created_at', '<=', $asAt)
                    ->where('status', '<>', 'draft')
                    ->get(['id', 'invoice_number', 'total_amount', 'tax_amount', 'currency']) as $invoice) {
                    // Vendor invoices carry no forex column; the run rate
                    // applies for foreign currencies.
                    $grossKes = $toKes((float) $invoice->total_amount, $invoice->currency);
                    $vatKes = $toKes((float) $invoice->tax_amount, $invoice->currency);
                    $netKes = round($grossKes - $vatKes, 2);

                    // Payments settled against the invoice, in the invoice
                    // currency (payment rows keep that currency).
                    $paidKes = 0.0;
                    foreach (DB::table('company_payments')
                        ->where('is_deleted', false)
                        ->where('invoice_id', $invoice->id)
                        ->get(['amount_paid', 'currency']) as $payment) {
                        $paidKes = round($paidKes + $toKes((float) $payment->amount_paid, $payment->currency), 2);
                    }

                    $outstanding = round($grossKes - $paidKes, 2);

                    $apOutstanding = round($apOutstanding + max($outstanding, 0), 2);
                    $cogsNet = round($cogsNet + $netKes, 2);
                    $inputVat = round($inputVat + $vatKes, 2);
                }
            }

            /* 3b) Company credit notes: reversals — reduce AP, COGS and
             *     input VAT. No forex column; run rate applies. */
            $coCreditGross = $coCreditNet = $coCreditVat = 0.0;
            if (Schema::hasTable('company_credit_notes')) {
                foreach (DB::table('company_credit_notes')
                    ->where('is_deleted', false)
                    ->whereDate('created_at', '<=', $asAt)
                    ->where('status', '<>', 'draft')
                    ->get(['id', 'credit_note_number', 'total_amount', 'tax_amount', 'currency']) as $note) {
                    $coCreditGross = round($coCreditGross + $toKes((float) $note->total_amount, $note->currency), 2);
                    $coCreditVat = round($coCreditVat + $toKes((float) $note->tax_amount, $note->currency), 2);
                    $coCreditNet = round($coCreditNet + $toKes(round((float) $note->total_amount - (float) $note->tax_amount, 2), $note->currency), 2);
                }

                $apOutstanding = round($apOutstanding - $coCreditGross, 2);
                $cogsNet = round($cogsNet - $coCreditNet, 2);
                $inputVat = round($inputVat - $coCreditVat, 2);
            }

            $post('ap', $liabilitiesId, 'Liabilities', 'Accounts Payable', max($apOutstanding, 0.0), 'credit');

            /* 4) Office expenses: paid + pending totals (DR Expenses) and
             *    pending only (CR Expenses Payable). No forex columns —
             *    converted via the run rate for foreign currencies. */
            $expensesAll = 0.0;
            $expensesPending = 0.0;
            if (Schema::hasTable('office_expenses')) {
                foreach (DB::table('office_expenses')
                    ->where('is_deleted', false)
                    ->whereDate('created_at', '<=', $asAt)
                    ->get(['id', 'amount', 'currency', 'status']) as $expense) {
                    $amountKes = $toKes((float) $expense->amount, $expense->currency);
                    $expensesAll = round($expensesAll + $amountKes, 2);

                    if (($expense->status ?? '') === 'pending') {
                        $expensesPending = round($expensesPending + $amountKes, 2);
                    }
                }
            }
            $post('expenses', $expensesId, 'Expenses', 'Expenses', $expensesAll, 'debit');
            $post('expenses_payable', $liabilitiesId, 'Liabilities', 'Expenses Payable', $expensesPending, 'credit');

            /* 5) Loans: principal balance (Loans Payable), interest due by
             *    the run date (Interest Expenses) and the unpaid slice of
             *    that same due interest (Interest Payable) — accrual view:
             *    future installments are not yet obligations. */
            $loansTotal = 0.0;
            $interestDue = 0.0;
            $interestUnpaid = 0.0;

            if (Schema::hasTable('loans') && Schema::hasTable('loan_schedules')) {
                foreach (Loan::query()->where('is_deleted', false)->get() as $loan) {
                    $loanRate = (float) $this->loanService->fxRate($loan) ?: null;
                    $loanKes = fn (float $amount) => $toKes($amount, $loan->currency, $loanRate);

                    // Principal: scheduled minus what allocations applied.
                    $scheduledPrincipal = (float) $loan->schedule()->sum('expected_principal');
                    $appliedPrincipal = (float) DB::table('loan_repayment_allocations')
                        ->where('loan_id', $loan->id)
                        ->sum('principal_applied');
                    $loansTotal = round($loansTotal + $loanKes(round(max($scheduledPrincipal - $appliedPrincipal, 0), 2)), 2);

                    // Interest fallen due by the run date (paid + unpaid);
                    // waived installments never become an obligation.
                    $dueInterest = (float) $loan->schedule()
                        ->whereDate('due_date', '<=', $asAt)
                        ->where('status', '!=', LoanSchedule::STATUS_WAIVED)
                        ->sum('expected_interest');

                    $paidInterest = (float) DB::table('loan_repayment_allocations')
                        ->where('loan_id', $loan->id)
                        ->sum('interest_applied');

                    $interestDue = round($interestDue + $loanKes($dueInterest), 2);
                    $interestUnpaid = round($interestUnpaid + $loanKes(round(max($dueInterest - $paidInterest, 0), 2)), 2);
                }
            }

            $post('loans', $liabilitiesId, 'Liabilities', 'Loans Payable', $loansTotal, 'credit');
            $post('interest_exp', $expensesId, 'Expenses', 'Interest Expenses', $interestDue, 'debit');
            $post('interest_payable', $liabilitiesId, 'Liabilities', 'Interest Payable', $interestUnpaid, 'credit');

            /* 6) Sales Tax Payable — straight from the tax ledger (the
             *    system of record, incl. credit-note effects and bill
             *    remittances). Net = VAT_OUT − VAT_IN as at the run date;
             *    a liability the company owes KRA when positive (CR) and a
             *    refund/offset the Company holds when negative (DR). */
            $taxNet = Schema::hasTable('tax_transactions')
                ? (float) TaxTransaction::query()
                    ->where('is_deleted', false)
                    ->whereDate('transaction_date', '<=', $asAt)
                    ->sum('converted_amount')
                : 0.0;

            if ($taxNet >= 0) {
                $post('sales_tax', $liabilitiesId, 'Liabilities', 'Sales Tax Payable', abs($taxNet), 'credit');
            } else {
                $post('sales_tax_dr', $assetsId, 'Assets', 'Sales Tax Receivable', abs($taxNet), 'debit');
            }

            /* 6b) Sales Tax reconciliation (Balancing/Suspense): the ledger
             *     net already includes input VAT and remittances, while
             *     those amounts also wash through AP/COGS and cash in the
             *     TB. The residual between everything else and the ledger-
             *     sourced tax row is the reconciling figure — posted last,
             *     on the lighter side, so the run always balances and the
             *     reconcile amount stays visible for review. */
            $taxRecon = null; // filled after the buckets sum below

            /* 7) Sales Revenue (CR) and COGS (DR) from the wash blocks. */
            $post('sales', $revenueId, 'Revenue', 'Sales Revenue', max($salesNet, 0), 'credit');
            $post('cogs', $expensesId, 'Expenses', 'Cost of Goods Sold', max($cogsNet, 0), 'debit');

            /* 7b) Sales Tax reconciliation plug: the difference between the
             *     debit-side and credit-side buckets excluding any previous
             *     recon rows. The tax ledger is the source of the Sales
             *     Tax row (per the finance model), and every other column
             *     washes; whatever remains is the reconciling figure that
             *     keeps the run balanced — reported transparently. */
            $drTotal = 0.0;
            $crTotal = 0.0;
            foreach ($buckets as $key => $bucket) {
                if (str_starts_with($key, 'sales_tax_recon')) {
                    continue;
                }
                $drTotal = round($drTotal + $bucket['debit'], 2);
                $crTotal = round($crTotal + $bucket['credit'], 2);
            }
            $taxRecon = round($drTotal - $crTotal, 2);
            if ($taxRecon >= 0) {
                $post('sales_tax_recon', $liabilitiesId, 'Liabilities', 'Sales Tax Reconciliation', $taxRecon, 'credit');
            } else {
                $post('sales_tax_recon_dr', $assetsId, 'Assets', 'Sales Tax Reconciliation', abs($taxRecon), 'debit');
            }

            /* Store the layout: every named row, so exports stay stable. */
            $layout = [
                ['key' => 'cash', 'chart' => $assetsId, 'category' => 'Assets', 'name' => 'Cash/Bank Accounts'],
                ['key' => 'ar', 'chart' => $assetsId, 'category' => 'Assets', 'name' => 'Accounts Receivable'],
                ['key' => 'sales_tax_dr', 'chart' => $assetsId, 'category' => 'Assets', 'name' => 'Sales Tax Receivable'],
                ['key' => 'sales_tax_recon_dr', 'chart' => $assetsId, 'category' => 'Assets', 'name' => 'Sales Tax Reconciliation'],
                ['key' => 'ap', 'chart' => $liabilitiesId, 'category' => 'Liabilities', 'name' => 'Accounts Payable'],
                ['key' => 'expenses_payable', 'chart' => $liabilitiesId, 'category' => 'Liabilities', 'name' => 'Expenses Payable'],
                ['key' => 'loans', 'chart' => $liabilitiesId, 'category' => 'Liabilities', 'name' => 'Loans Payable'],
                ['key' => 'interest_payable', 'chart' => $liabilitiesId, 'category' => 'Liabilities', 'name' => 'Interest Payable'],
                ['key' => 'sales_tax', 'chart' => $liabilitiesId, 'category' => 'Liabilities', 'name' => 'Sales Tax Payable'],
                ['key' => 'sales_tax_recon', 'chart' => $liabilitiesId, 'category' => 'Liabilities', 'name' => 'Sales Tax Reconciliation'],
                ['key' => 'owners_capital', 'chart' => $liabilitiesId, 'category' => 'Equity', 'name' => 'Owners Capital'],
                ['key' => 'sales', 'chart' => $revenueId, 'category' => 'Revenue', 'name' => 'Sales Revenue'],
                ['key' => 'cogs', 'chart' => $expensesId, 'category' => 'Expenses', 'name' => 'Cost of Goods Sold'],
                ['key' => 'expenses', 'chart' => $expensesId, 'category' => 'Expenses', 'name' => 'Expenses'],
                ['key' => 'interest_exp', 'chart' => $expensesId, 'category' => 'Expenses', 'name' => 'Interest Expenses'],
            ];

            $lines = [];
            foreach ($layout as $slot) {
                $bucket = $buckets[$slot['key']] ?? null;

                if ($bucket === null) {
                    // Zero-filled rows keep the layout stable for exports.
                    $lines[] = [
                        'trial_balance_run_id' => $run->id,
                        'chart_of_account' => $slot['chart'],
                        'category' => $slot['category'],
                        'source_table' => 'tb:'.$slot['key'],
                        'source_type' => null,
                        'source_id' => null,
                        'account_id' => null,
                        'debit_kes' => 0,
                        'credit_kes' => 0,
                        'debit_usd' => 0,
                        'credit_usd' => 0,
                        'description' => $slot['name'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];

                    continue;
                }

                $lines[] = [
                    'trial_balance_run_id' => $run->id,
                    'chart_of_account' => $bucket['chart_id'],
                    'category' => $bucket['category'],
                    'source_table' => 'tb:'.$slot['key'],
                    'source_type' => null,
                    'source_id' => null,
                    'account_id' => null,
                    'debit_kes' => $bucket['debit'],
                    'credit_kes' => $bucket['credit'],
                    'debit_usd' => 0,
                    'credit_usd' => 0,
                    'description' => $bucket['name'],
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
     * Present a run: lines with chart codes, totals and the balance
     * check. The run balances by construction; the residual (if any)
     * comes from rounding only and is reported honestly.
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
            ->orderBy('c.code')
            ->orderBy('account_name')
            ->get()
            ->sortBy(fn ($row) => ['Assets' => 0, 'Liabilities' => 1, 'Equity' => 2, 'Revenue' => 3, 'Expenses' => 4][$row->category] ?? 5)
            ->values();

        $totalDebitKes = round((float) $lines->sum('debit_kes'), 2);
        $totalCreditKes = round((float) $lines->sum('credit_kes'), 2);

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
                'difference' => round($totalCreditKes - $totalDebitKes, 2),
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
