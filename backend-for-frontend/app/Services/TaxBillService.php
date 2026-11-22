<?php

namespace App\Services;

use App\Models\Account;
use App\Models\TaxBill;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Monthly VAT runs ("tax bills").
 *
 * A run snapshots one calendar month's ledger positions into a tax bill:
 * output VAT (VAT_OUT), recoverable input VAT (VAT_IN) and the resulting
 * liability. One bill per period month — a month can only be billed once,
 * and a paid bill is closed.
 *
 * Settlement is a single installment paid from a bank account:
 *  - a row in the transactions ledger (expense out of the chosen bank
 *    account, chart 2000),
 *  - the account balance is reduced,
 *  - the tax ledger receives a VAT_IN (DR) entry sourced on the bill, which
 *    reduces the running liability exactly like recoverable VAT settles.
 */
class TaxBillService
{
    public function index(array $filters = [], int $perPage = 15, int $page = 1)
    {
        $query = TaxBill::query();

        if (! empty($filters['from']) && ! empty($filters['to'])) {
            // Window over period months.
            $fromYear = (int) substr((string) $filters['from'], 0, 4);
            $fromMonth = (int) substr((string) $filters['from'], 5, 2);
            $toYear = (int) substr((string) $filters['to'], 0, 4);
            $toMonth = (int) substr((string) $filters['to'], 5, 2);
            $fromKey = $fromYear * 12 + $fromMonth;
            $toKey = $toYear * 12 + $toMonth;

            $query->whereRaw('(period_year * 12 + period_month) BETWEEN ? AND ?', [$fromKey, $toKey]);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        $query->orderBy('id', 'desc');

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function find(int $id): TaxBill
    {
        return TaxBill::query()->findOrFail($id);
    }

    /**
     * Compute and persist the month's bill from the current ledger state.
     *
     * @throws ValidationException when the month was already billed, or has
     *                             not been completed yet.
     */
    public function runMonth(int $year, int $month, ?int $userId): TaxBill
    {
        if ($month < 1 || $month > 12) {
            throw ValidationException::withMessages([
                'period_month' => ['Month must be between 1 and 12.'],
            ]);
        }

        // Only completed months can be billed: the current (or a future)
        // month may still receive VAT entries, so its run would not be the
        // final position.
        $monthStart = Carbon::create($year, $month, 1)->startOfDay();
        if ($monthStart >= now()->startOfDay()->startOfMonth()) {
            $label = $monthStart->format('F Y');

            throw ValidationException::withMessages([
                'period_month' => ["{$label} has not been completed yet — tax bills can only be run for finished months."],
            ]);
        }

        $exists = TaxBill::query()
            ->where('period_year', $year)
            ->where('period_month', $month)
            ->where('is_deleted', false)
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'period_month' => ["A tax bill for {$year}-".str_pad((string) $month, 2, '0', STR_PAD_LEFT).' already exists. A month can only be billed once.'],
            ]);
        }

        $from = sprintf('%04d-%02d-01', $year, $month);
        $to = Carbon::create($year, $month, 1)->endOfMonth()->toDateString();

        $positions = TaxTransactionService::vatPositions($from, $to);

        // A bill may only be raised on a liability (net payable). Zero or
        // net-recoverable months have nothing to pay the agency.
        $liability = $positions['net'];
        if ($liability <= 0) {
            throw ValidationException::withMessages([
                'period_month' => ['No payable VAT liability for the selected month — nothing to bill.'],
            ]);
        }

        return DB::transaction(function () use ($year, $month, $userId, $positions, $liability, $from, $to) {
            $billNumber = $this->nextBillNumber();

            return TaxBill::create([
                'bill_number' => $billNumber,
                'period_month' => $month,
                'period_year' => $year,
                'vat_out' => $positions['vat_out'],
                'vat_in' => $positions['vat_in'],
                'vat_liability' => $liability,
                // The payable amount mirrors the month's net liability.
                'amount' => $liability,
                'paid_amount' => 0,
                'balance' => $liability,
                'status' => TaxBill::STATUS_PENDING_PAYMENT,
                'run_date' => now()->toDateString(),
                'notes' => 'VAT run for '.$from.' to '.$to.' (ledger snapshot at run time)',
                'created_by' => $userId,
                'updated_by' => $userId,
            ]);
        });
    }

    /**
     * Settle the bill in a single installment from a bank account.
     *
     * Posts:
     *  1. A transactions-ledger row (expense): debits the chosen bank
     *     account, chart 2000, sourced on the tax bill.
     *  2. A tax-ledger VAT_IN (DR) entry sourced on the bill, reducing the
     *     running liability (same mechanism as recoverable input VAT).
     *  3. The account balance decrease and the bill's paid state.
     */
    public function payFromAccount(TaxBill $bill, array $data, ?int $userId): TaxBill
    {
        if ($bill->isPaid()) {
            throw ValidationException::withMessages([
                'status' => ['This tax bill has already been paid and cannot accept another payment.'],
            ]);
        }

        if (round((float) $bill->balance, 2) < 0.005) {
            throw ValidationException::withMessages([
                'amount' => ['This tax bill has no outstanding balance.'],
            ]);
        }

        $validated = validator($data, [
            'account_id' => ['required', 'integer', 'exists:accounts,id'],
            'payment_date' => ['required', 'date'],
            'reference' => ['nullable', 'string', 'max:255'],
            'narration' => ['nullable', 'string', 'max:255'],
        ])->validate();

        return DB::transaction(function () use ($bill, $validated, $userId) {
            $bill = TaxBill::query()->whereKey($bill->id)->lockForUpdate()->firstOrFail();

            if ($bill->isPaid()) {
                throw ValidationException::withMessages([
                    'status' => ['This tax bill has already been paid and cannot accept another payment.'],
                ]);
            }

            $amount = round((float) $bill->balance, 2);
            $account = Account::query()->lockForUpdate()->findOrFail($validated['account_id']);

            if (! (bool) $account->overdraft_allowed && (float) $account->balance < $amount) {
                throw ValidationException::withMessages([
                    'account_id' => ['Selected account has insufficient balance and overdraft is not allowed.'],
                ]);
            }

            $transactionNumber = (new CommonService)->generateUniqueCode('TAXPAY-');
            $paymentDate = Carbon::parse($validated['payment_date']);

            // 1) The settling movement in the transactions ledger. Debit the
            //    funding account (money leaves), credit source = the tax bill.
            $transaction = Transaction::create([
                'transaction_number' => $transactionNumber,
                'transaction_type' => 'expense',
                'transaction_date' => $paymentDate->toDateString(),
                'posted_date' => now()->toDateString(),
                'amount' => $amount,
                'transaction_currency' => 'KES',
                'base_currency' => 'KES',
                'exchange_rate' => 1,
                'converted_amount' => $amount,
                'tax_amount' => $amount,
                'converted_tax_amount' => $amount,
                'net_amount' => 0,
                'converted_net_amount' => 0,
                'source_type' => 'tax_bill',
                'source_id' => $bill->id,
                'account_debit' => $account->id,
                'account_credit' => null,
                'chart_of_account' => $this->taxChartId(),
                'category' => 'expense',
                'payment_method' => 'internal_transfer',
                'transaction_status' => 'cleared',
                'bank_account' => $validated['reference'] ?? null,
                'related_transaction_id' => null,
                'narration' => $validated['narration'] ?? ('VAT payment for '.$bill->label().' ('.$bill->bill_number.')'),
                'is_recurring' => false,
                'fiscal_year' => $paymentDate->year,
                'accounting_period' => $paymentDate->format('Ym'),
                'is_adjusting_entry' => false,
                'cost_center_id' => null,
                'created_by' => $userId,
                'updated_by' => $userId,
            ]);

            // 2) Reduce the declared liability in the tax ledger: a debit
            //    (VAT_IN) entry sourced on the bill, dated on the payment —
            //    the chronological audit trail. Per-period attribution to
            //    the billed month rides on the bill (settled_for_period),
            //    so paying month 1's bill in month 2 still clears month 1.
            $ledgerEntry = TaxTransactionService::record([
                'side' => TaxTransactionService::SIDE_DR,
                'entry_type' => TaxTransactionService::ENTRY_VAT_IN,
                'direction' => TaxTransactionService::DIRECTION_PAID,
                'source_type' => 'tax_bill',
                'source_id' => $bill->id,
                'amount' => $amount,
                'transaction_currency' => 'KES',
                'exchange_rate' => 1,
                'transaction_date' => $paymentDate->toDateString(),
                'narration' => 'VAT remittance for '.$bill->label().' ('.$bill->bill_number.')'
                    .' — settles VAT for '.$bill->periodIdentifier(),
                'created_by' => $userId,
            ]);

            // 3) Reduce the funding account balance.
            $account->balance = (string) number_format((float) $account->balance - $amount, 2, '.', '');
            $account->updated_at = now();
            $account->updated_by = $userId;
            $account->save();

            $paidAt = $paymentDate->toDateString();

            // The payment settles the bill's own period. When the payment
            // happens in a later month, the ledger carries the chronological
            // audit trail while this bill records the exact per-period
            // effect: what it settled for its month, and any over-payment
            // that funds later liability (carried forward).
            $bill->paid_amount = $amount;
            $bill->balance = round((float) $bill->amount - $amount, 2);
            $bill->status = TaxBill::STATUS_PAID;
            $bill->paid_date = $paidAt;
            $bill->transaction_id = $transaction->id;
            $bill->tax_ledger_entry_id = $ledgerEntry?->id;
            $bill->paid_from_account = (string) $account->id;
            $bill->settled_for_period = round(min($amount, (float) $bill->amount), 2);
            $bill->carried_forward = round(max($amount - (float) $bill->amount, 0), 2);
            $bill->updated_by = $userId;
            $bill->updated_at = now();
            $bill->save();

            return $bill->fresh(['transaction', 'taxLedgerEntry']);
        });
    }

    /**
     * Per-period reconciliation across bills: what each month declared,
     * how much of its liability its own settlement covered (even when that
     * settlement posts in a later month, after further ledger entries), and
     * what remains outstanding. Robust by construction — the attribution
     * rides on each bill's own state, not on entry ordering.
     *
     * @return array<int, array{period: string, year: int, month: int, bill_number: ?string,
     *     declared: float, settled_for_period: float, carried_forward: float,
     *     outstanding: float, status: ?string, paid_date: ?string, payment_date: ?string}>
     */
    public static function periodReconciliation(?string $from = null, ?string $to = null): array
    {
        $bills = TaxBill::query()
            ->where('is_deleted', false)
            ->orderBy('period_year')
            ->orderBy('period_month')
            ->get();

        if ($from || $to) {
            $fromKey = $from ? ((int) substr($from, 0, 4)) * 12 + (int) substr($from, 5, 2) : 0;
            $toKey = $to ? ((int) substr($to, 0, 4)) * 12 + (int) substr($to, 5, 2) : PHP_INT_MAX;

            $bills = $bills->filter(function (TaxBill $bill) use ($fromKey, $toKey) {
                $key = $bill->period_year * 12 + $bill->period_month;

                return $key >= $fromKey && $key <= $toKey;
            });
        }

        return $bills->map(fn (TaxBill $bill) => [
            'period' => $bill->periodIdentifier(),
            'year' => (int) $bill->period_year,
            'month' => (int) $bill->period_month,
            'bill_number' => $bill->bill_number,
            'declared' => (float) $bill->vat_liability,
            'settled_for_period' => (float) $bill->settled_for_period,
            'carried_forward' => (float) $bill->carried_forward,
            'outstanding' => round((float) $bill->balance, 2),
            'status' => $bill->status,
            'paid_date' => $bill->paid_date?->toDateString(),
            'payment_date' => $bill->transaction?->transaction_date
                ? (string) $bill->transaction->transaction_date
                : null,
        ])->values()->all();
    }

    /**
     * True when every billed period is fully settled (no outstanding
     * balances). Outstanding liability that was never billed lives outside
     * this check — it is not attributable to a bill yet.
     */
    public static function allPeriodsSettled(): bool
    {
        return ! TaxBill::query()
            ->where('is_deleted', false)
            ->where('status', TaxBill::STATUS_PENDING_PAYMENT)
            ->exists();
    }

    /** Sequential bill numbers: TAXBILL-000001. */
    protected function nextBillNumber(): string
    {
        $latest = TaxBill::withDeleted()->orderBy('id', 'desc')->first();
        $next = $latest ? ((int) substr((string) $latest->bill_number, strlen('TAXBILL-')) + 1) : 1;

        return 'TAXBILL-'.str_pad((string) $next, 6, '0', STR_PAD_LEFT);
    }

    protected function taxChartId(): ?int
    {
        try {
            $id = DB::table('chart_of_accounts')->where('code', TaxTransactionService::CHART_TAX_PAYABLE_CODE)->value('id');

            return $id ? (int) $id : null;
        } catch (\Throwable) {
            return null;
        }
    }
}
