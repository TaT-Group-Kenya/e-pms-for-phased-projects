<?php

namespace App\Services;

use App\Models\Account;
use App\Models\Loan;
use App\Models\LoanRepayment;
use App\Models\LoanSchedule;
use App\Models\Transaction;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class LoanService
{
    /**
     * Number of payment periods implied by the loan frequency per year.
     */
    public static function periodsPerYear(string $frequency): int
    {
        return match ($frequency) {
            Loan::FREQUENCY_WEEKLY => 52,
            Loan::FREQUENCY_QUARTERLY => 4,
            default => 12,
        };
    }

    /**
     * Interval in days/months used to advance due dates.
     */
    private static function addPeriod(string $frequency, CarbonImmutable $date): CarbonImmutable
    {
        return match ($frequency) {
            Loan::FREQUENCY_WEEKLY => $date->addWeek(),
            Loan::FREQUENCY_QUARTERLY => $date->addMonthsNoOverflow(3),
            default => $date->addMonthsNoOverflow(1),
        };
    }

    /**
     * Compute the fixed periodic installment for the given loan terms.
     */
    public function computeInstallment(
        float $principal,
        string $interestType,
        float $annualRatePercent,
        int $tenure,
        string $frequency
    ): float {
        if ($tenure <= 0 || $principal <= 0) {
            return 0.0;
        }

        $n = self::periodsPerYear($frequency);

        if ($interestType === Loan::INTEREST_NONE) {
            return round($principal / $tenure, 2);
        }

        if ($interestType === Loan::INTEREST_FLAT) {
            $totalInterest = $principal * ($annualRatePercent / 100) * ($tenure / $n);

            return round(($principal + $totalInterest) / $tenure, 2);
        }

        // Reducing balance: standard annuity formula with the periodic rate.
        $r = ($annualRatePercent / 100) / $n;

        if ($r <= 0) {
            return round($principal / $tenure, 2);
        }

        return round($principal * ($r * pow(1 + $r, $tenure)) / (pow(1 + $r, $tenure) - 1), 2);
    }

    /**
     * Build and persist the installment plan for a loan.
     */
    public function generateSchedule(Loan $loan): void
    {
        $loan->loadMissing('schedule');
        $loan->schedule()->delete();

        $installment = $loan->installment_amount
            ?? $this->computeInstallment(
                (float) $loan->principal,
                $loan->interest_type,
                (float) $loan->interest_rate,
                (int) $loan->tenure_months,
                $loan->repayment_frequency
            );

        $start = CarbonImmutable::parse(
            $loan->first_payment_date ?? $loan->disbursement_date
        );

        // For reducing balance the interest share declines per period, for
        // flat it is constant, for none it is zero.
        $r = ($loan->interest_type === Loan::INTEREST_NONE)
            ? 0.0
            : ((float) $loan->interest_rate / 100) / self::periodsPerYear($loan->repayment_frequency);

        if ($loan->interest_type === Loan::INTEREST_FLAT) {
            // Spread the total flat interest evenly over all installments.
            $n = self::periodsPerYear($loan->repayment_frequency);
            $totalInterest = round((float) $loan->principal * ((float) $loan->interest_rate / 100) * ((int) $loan->tenure_months / $n), 2);
            $interestPerInst = round($totalInterest / $loan->tenure_months, 2);
        }

        $rows = [];
        $remaining = (float) $loan->principal;

        for ($i = 1; $i <= (int) $loan->tenure_months; $i++) {
            if ($loan->interest_type === Loan::INTEREST_REDUCING) {
                $expectedInterest = round($remaining * $r, 2);
                $expectedPrincipal = round($installment - $expectedInterest, 2);
            } elseif ($loan->interest_type === Loan::INTEREST_FLAT) {
                $expectedInterest = $interestPerInst;
                $expectedPrincipal = round($installment - $expectedInterest, 2);
            } else {
                $expectedInterest = 0.0;
                $expectedPrincipal = round($installment, 2);
            }

            // Adjust the final installment so the principal fully amortizes.
            if ($i === (int) $loan->tenure_months) {
                $expectedPrincipal = round($remaining, 2);
            }

            $remaining = round($remaining - $expectedPrincipal, 2);

            $rows[] = [
                'loan_id' => $loan->id,
                'installment_number' => $i,
                'due_date' => $start->toDateString(),
                'expected_principal' => max($expectedPrincipal, 0),
                'expected_interest' => max($expectedInterest, 0),
                'status' => LoanSchedule::STATUS_PENDING,
                'created_at' => now(),
                'created_by' => Auth::id(),
            ];

            $start = self::addPeriod($loan->repayment_frequency, $start);
        }

        DB::table('loan_schedules')->insert($rows);
    }

    /**
     * Record a new loan. The account's loan balance reflects the borrowed
     * amount (principal) immediately upon addition — before disbursement —
     * so Loans accounts are tracked as soon as a loan is registered.
     */
    /**
     * Record a new loan and disburse the funds in one all-or-nothing
     * transaction: ledger entry crediting the destination asset account
     * ("loan disbursement {id}"), destination cash balance, loan balance,
     * installment plan and status all commit together or not at all.
     */
    public function createLoan(array $data, int $userId): Loan
    {
        return DB::transaction(function () use ($data, $userId) {
            if ((int) ($data['tenure_months'] ?? 0) < 1) {
                throw new InvalidArgumentException('Loan tenure must be at least one installment.');
            }

            if ((float) ($data['principal'] ?? 0) <= 0) {
                throw new InvalidArgumentException('Loan principal must be greater than zero.');
            }

            $data['created_by'] = $userId;
            $data['created_at'] = now();
            // Funding happens immediately, so the loan is born active.
            $data['status'] = Loan::STATUS_ACTIVE;

            /*
             * Forex handling (USD→KES):
             *  - A non-KES loan requires an explicit forex_rate (validated
             *    upstream and enforced here as a hard check).
             *  - KES loans use rate 1 — the UI never asks for a rate.
             *  - USD columns (principal/installment) stay in the loan's
             *    operating currency for schedule + repayments; the _kes
             *    columns store the booked KES equivalents for the TB.
             */
            $requestedRate = isset($data['forex_rate']) && (float) $data['forex_rate'] > 0
                ? (float) $data['forex_rate']
                : null;
            unset($data['forex_rate']);

            $fxRate = ($data['currency'] ?? 'KES') === 'KES'
                ? 1.0
                : ($requestedRate ?? throw new InvalidArgumentException(
                    'A USD to KES forex rate is required for non-KES loans.'
                ));

            $loan = Loan::create($data);
            $loan->installment_amount = $this->computeInstallment(
                (float) $loan->principal,
                $loan->interest_type,
                (float) $loan->interest_rate,
                (int) $loan->tenure_months,
                $loan->repayment_frequency
            );
            // Booked KES equivalents.
            $loan->principal_kes = round((float) $loan->principal * $fxRate, 2);
            $loan->installment_amount_kes = round((float) $loan->installment_amount * $fxRate, 2);
            $loan->updated_at = now();
            $loan->save();

            // Ledger entry crediting the destination asset account with the
            // borrowed cash, narrated with the loan reference.
            $loan->disbursement_transaction_id = $this->createDisbursementTransaction(
                $loan,
                (float) $loan->principal,
                "loan disbursement {$loan->id}",
                $userId,
                new CommonService
            )->id;
            $loan->updated_at = now();
            $loan->save();

            // Account: the borrowed cash lands on the destination asset
            // account; the loan obligation itself is tracked by the Loan
            // model (schedule + allocations), not on the account.
            $destination = $loan->destination;
            $destination->balance = round((float) $destination->balance + (float) $loan->principal, 2);
            $destination->updated_by = $userId;
            $destination->updated_at = now();
            $destination->save();

            // Build the installment plan once the loan is persisted.
            $this->generateSchedule($loan);

            return $loan;
        });
    }

    /**
     * Record a repayment against the loan. Money moves from a paying asset
     * account out to the lender; the loan's outstanding obligation reduces.
     */
    public function repay(Loan $loan, array $data, int $userId): LoanRepayment
    {
        if ($loan->status !== Loan::STATUS_ACTIVE) {
            throw new InvalidArgumentException('Repayments are only allowed on an active loan.');
        }

        $amount = round((float) $data['amount'], 2);

        if ($amount <= 0) {
            throw new InvalidArgumentException('Repayment amount must be greater than zero.');
        }

        $loan->refresh();

        // A repayment may cover any number of installments, or settle the
        // loan early. The hard ceiling is everything still owed: remaining
        // principal plus interest that has fallen due but is uncollected.
        // (Future interest is deliberately NOT part of this ceiling — the
        // schedule accrues it as time passes; the repayable-minus-paid
        // outstandingBalance() already includes it for the trial balance.)
        $remainingPrincipal = round(
            (float) $loan->schedule()->sum('expected_principal')
            - (float) DB::table('loan_repayment_allocations')->where('loan_id', $loan->id)->sum('principal_applied'),
            2
        );
        $accruedAtEntry = $this->accruedInterest($loan);
        $totalDue = round($remainingPrincipal + $accruedAtEntry, 2);

        if ($amount > $totalDue) {
            throw new InvalidArgumentException(
                'Repayment amount exceeds the total due of '.number_format($totalDue, 2).' '.$loan->currency
                    .' (outstanding '.number_format($remainingPrincipal, 2).' + fallen-due interest '
                    .number_format($accruedAtEntry, 2).').'
            );
        }

        // Split: accrued (fallen-due) interest is settled first, remainder
        // reduces principal (standard practice).
        $accruedInterest = $accruedAtEntry;
        $interestComponent = round(min($amount, $accruedInterest), 2);
        $principalComponent = round(round($amount, 2) - $interestComponent, 2);

        $paidFromAccount = Account::findOrFail($data['paid_from_account_id']);

        // Repayments must leave a real cash account — asset chart 1000 —
        // because the money physically goes out to the lender.
        if ($paidFromAccount->chartOfAccount?->code !== '1000') {
            throw new InvalidArgumentException(
                'Repayments can only be paid from asset (chart 1000) accounts.'
            );
        }

        if ($paidFromAccount->currency !== $loan->currency) {
            throw new InvalidArgumentException(
                'Paying account currency must match the loan currency ('.$loan->currency.').'
            );
        }

        if ((float) $paidFromAccount->balance < $amount) {
            throw new InvalidArgumentException('Paying account does not have enough balance for this repayment.');
        }

        $paymentDate = $data['payment_date'] ?? now()->toDateString();

        return DB::transaction(function () use ($loan, $data, $amount, $interestComponent, $principalComponent, $paidFromAccount, $paymentDate, $userId) {
            $commonService = new CommonService;
            $narration = $data['notes'] ?? null;
            $narration = trim((string) $narration) ?: ('Loan repayment to '.$loan->lender_name);

            // Trial-balance-exact ledger legs: the money leaving the system
            // is split into its interest component (its own transaction
            // type 'interest', an expense, 5000) and its principal component
            // ('loan_principal', a liability reduction, 2000) so each chart
            // and each type only accumulates the amounts that genuinely
            // belong to it. Component-less repayments produce a single leg.
            $legs = [];
            if ($interestComponent > 0) {
                $legs[] = [
                    'amount' => $interestComponent,
                    'type' => Transaction::TYPE_INTEREST,
                    'chart' => Transaction::expenseChartId(),
                    'narration' => $narration.' — interest',
                ];
            }
            if ($principalComponent > 0) {
                $legs[] = [
                    'amount' => $principalComponent,
                    'type' => Transaction::TYPE_LOAN_PRINCIPAL,
                    'chart' => $loan->chart_of_account,
                    'narration' => $narration.' — principal',
                ];
            }
            if (empty($legs)) {
                // Nothing allocatable (shouldn't happen due to earlier checks).
                $legs[] = [
                    'amount' => (float) $amount,
                    'type' => 'expense',
                    'chart' => null,
                    'narration' => $narration,
                ];
            }

            $debit = null;
            foreach ($legs as $leg) {
                $debit = $this->createRepaymentLeg(
                    $loan,
                    $leg['type'],
                    $leg['amount'],
                    $loan->destination->currency,
                    $paidFromAccount->id,
                    null,
                    $leg['narration'],
                    $userId,
                    $commonService,
                    $leg['chart']
                );

                if ($leg['type'] === Transaction::TYPE_LOAN_PRINCIPAL) {
                    // The loan's repayment transaction_id points at the
                    // principal leg (the liability reduction) for statements.
                    $transactionId = $debit->id;
                }
            }

            if (! isset($transactionId)) {
                $transactionId = $debit->id;
            }

            // Reduce the paying account cash balance: the money leaves the
            // system to the lender. The destination account's balance is NOT
            // touched by a repayment — it only changes when loan cash is
            // disbursed onto it or when its own account transactions move it.
            $paidFromAccount->balance = (float) $paidFromAccount->balance - $amount;
            $paidFromAccount->updated_at = now();
            $paidFromAccount->updated_by = $userId;
            $paidFromAccount->save();

            // Record both the real (loan currency) components and the
            // converted (KES, at the loan's booked forex rate) components.
            $fxRate = $this->fxRate($loan);

            $repayment = LoanRepayment::create([
                'loan_id' => $loan->id,
                'transaction_id' => $debit->id,
                'schedule_installment_id' => $data['schedule_installment_id'] ?? null,
                'payment_date' => $paymentDate,
                'amount_paid' => $amount,
                'amount_paid_kes' => round($amount * $fxRate, 2),
                'principal_component' => $principalComponent,
                'principal_component_kes' => round($principalComponent * $fxRate, 2),
                'interest_component' => $interestComponent,
                'interest_component_kes' => round($interestComponent * $fxRate, 2),
                'exchange_rate' => $fxRate,
                'balance_after' => null,
                'paid_from_account_id' => $paidFromAccount->id,
                'payment_reference' => $data['payment_reference'] ?? null,
                'notes' => $data['notes'] ?? null,
                'created_at' => now(),
                'created_by' => $userId,
            ]);

            $this->updateScheduleAfterRepayment($loan, $repayment, $userId);

            // Per-loan outstanding after this payment (schedule-based, now
            // that this payment's allocations are recorded).
            $repayment->balance_after = $this->outstandingBalance($loan->fresh());
            $repayment->save();

            $finalRemainingPrincipal = round(
                (float) $loan->schedule()->sum('expected_principal')
                - (float) DB::table('loan_repayment_allocations')->where('loan_id', $loan->id)->sum('principal_applied'),
                2
            );

            if ($finalRemainingPrincipal <= 0
                && round($this->accruedInterest($loan->fresh()), 2) <= 0) {
                // Early (or full) settlement: nothing remains owed — pending,
                // overdue and any partially paid installments are closed out.
                $loan->schedule()
                    ->whereIn('status', [
                        LoanSchedule::STATUS_PENDING,
                        LoanSchedule::STATUS_OVERDUE,
                        LoanSchedule::STATUS_PARTIAL,
                    ])
                    ->update([
                        'status' => LoanSchedule::STATUS_WAIVED,
                        'updated_at' => now(),
                        'updated_by' => $userId,
                    ]);

                $loan->status = Loan::STATUS_CLOSED;
                $loan->updated_by = $userId;
                $loan->updated_at = now();
                $loan->save();
            }

            return $repayment;
        });
    }

    /**
     * Principal still owed on THIS loan specifically: scheduled principal
     * minus what allocations have applied — never any account-level state.
     */
    /**
     * Outstanding balance = principal still owed (schedule − applied).
     * KES-only bookkeeping; the trial balance/report use
     * repayablePaidBalance() for the repayable−repaid figure.
     */
    public function outstandingBalance(Loan $loan): float
    {
        $scheduled = (float) $loan->schedule()->sum('expected_principal');

        $applied = (float) DB::table('loan_repayment_allocations')
            ->where('loan_id', $loan->id)
            ->sum('principal_applied');

        return round(max($scheduled - $applied, 0), 2);
    }

    /**
     * Repayable-basis balance = Total Repayable − Total Repaid. Used by the
     * Loans report and Trial Balance display so a loan's remaining
     * obligation (incl. future interest) reads as one figure.
     */
    public function repayablePaidBalance(Loan $loan): float
    {
        $summary = $this->summary($loan);

        return round(max($summary['total_repayable'] - $summary['total_repaid'], 0), 2);
    }

    /**
     * Uncollected interest that has fallen due: interest scheduled on
     * installments whose due date has arrived (or which already received
     * payments) minus interest already collected. Future interest is not
     * yet receivable and must not swallow principal.
     *
     * The cutoff defaults to today; trial-balance runs pass their as-at
     * date so historical snapshots accrue only to that point.
     */
    public function accruedInterest(Loan $loan, ?string $asAt = null): float
    {
        $cutoff = $asAt ?? now()->toDateString();

        $dueInterest = (float) $loan->schedule()
            ->whereDate('due_date', '<=', $cutoff)
            ->where('status', '!=', LoanSchedule::STATUS_WAIVED)
            ->sum('expected_interest');

        // Loans whose schedule starts in the future: nothing accrued yet.
        $collected = (float) $loan->repayments()->sum('interest_component');

        return round(max($dueInterest - $collected, 0), 2);
    }

    /**
     * Totals for the UI summary cards.
     */
    public function summary(Loan $loan): array
    {
        $loan->loadMissing('destination', 'repayments', 'schedule');

        $totalRepaid = round((float) $loan->repayments->sum('amount_paid'), 2);
        $principalRepaid = round((float) $loan->repayments->sum('principal_component'), 2);
        $interestRepaid = round((float) $loan->repayments->sum('interest_component'), 2);

        $nextDue = $loan->schedule
            ->where('status', '!=', LoanSchedule::STATUS_PAID)
            ->where('status', '!=', LoanSchedule::STATUS_WAIVED)
            ->sortBy('due_date')
            ->first();

        // Total interest over the full tenure from the schedule (the truth
        // source once generated). Fall back to the terms math for loans
        // whose schedule has not been generated yet.
        $totalInterest = round((float) $loan->schedule->sum('expected_interest'), 2);

        $totalRepayable = round((float) $loan->principal + ($totalInterest > 0
            ? $totalInterest
            : $this->totalInterestFromTerms($loan)), 2);

        return [
            'principal' => (float) $loan->principal,
            'loan_balance' => round(max((float) $totalRepayable - (float) $totalRepaid, 0), 2),
            'outstanding_balance' => round(
                max((float) $loan->schedule->sum('expected_principal')
                    - (float) DB::table('loan_repayment_allocations')->where('loan_id', $loan->id)->sum('principal_applied'), 0),
                2
            ),
            'total_repaid' => $totalRepaid,
            'principal_repaid' => $principalRepaid,
            'interest_repaid' => $interestRepaid,
            'accrued_interest' => $this->accruedInterest($loan),
            'total_interest' => max($totalInterest, $this->totalInterestFromTerms($loan)),
            'total_repayable' => $totalRepayable,
            'installment_amount' => (float) $loan->installment_amount,
            'next_due_date' => $nextDue?->due_date?->toDateString(),
            'next_due_amount' => $nextDue
                ? round($nextDue->expected_principal + $nextDue->expected_interest, 2)
                : null,
            'status' => $loan->status,
        ];
    }

    /**
     * Whole-loan interest implied by the loan terms (schedule-independent).
     */
    private function totalInterestFromTerms(Loan $loan): float
    {
        if ($loan->interest_type === Loan::INTEREST_NONE || (float) $loan->interest_rate <= 0) {
            return 0.0;
        }

        $n = self::periodsPerYear($loan->repayment_frequency);
        $tenure = (int) $loan->tenure_months;
        $r = ((float) $loan->interest_rate / 100) / $n;

        if ($loan->interest_type === Loan::INTEREST_FLAT) {
            return round((float) $loan->principal * ((float) $loan->interest_rate / 100) * ($tenure / $n), 2);
        }

        // Reducing balance: total interest = (installment × tenure) − principal.
        $installment = (float) ($loan->installment_amount ?: $this->computeInstallment(
            (float) $loan->principal,
            $loan->interest_type,
            (float) $loan->interest_rate,
            $tenure,
            $loan->repayment_frequency
        ));

        return round(max($installment * $tenure - (float) $loan->principal, 0), 2);
    }

    /**
     * The loan's booked USD→KES rate. KES loans: 1. Non-KES: the rate the
     * user entered at creation (principal_kes / principal), falling back to
     * 1 for legacy rows so nothing divides by zero.
     */
    public function fxRate(Loan $loan): float
    {
        if ($loan->currency === 'KES') {
            return 1.0;
        }

        if ((float) $loan->principal > 0 && (float) $loan->principal_kes > 0) {
            return round((float) $loan->principal_kes / (float) $loan->principal, 6);
        }

        return 1.0;
    }

    private function createDisbursementTransaction(
        Loan $loan,
        float $amount,
        string $narration,
        int $userId,
        CommonService $commonService
    ): Transaction {
        $exchangeRate = $this->fxRate($loan);

        return app(TransactionService::class)->create([
            'transaction_number' => $commonService->generateUniqueCode('TRX-'),
            'transaction_type' => 'topup',
            'transaction_date' => $loan->disbursement_date->toDateString(),
            'posted_date' => now()->toDateString(),
            'amount' => $amount,
            'base_currency' => $loan->currency,
            'tax_amount' => 0,
            'net_amount' => $amount,
            'transaction_currency' => $loan->currency,
            'exchange_rate' => $exchangeRate,
            'converted_amount' => round($amount * $exchangeRate, 2),
            'converted_tax_amount' => 0,
            'converted_net_amount' => round($amount * $exchangeRate, 2),
            'customer_id' => null,
            'company_id' => null,
            'source_type' => 'loan_disbursement',
            'source_id' => $loan->id,
            'account_debit' => null,
            'account_credit' => $loan->destination_account_id,
            'category' => 'revenue',
            'payment_method' => 'CASH',
            'bank_account' => null,
            'check_number' => null,
            'transaction_status' => 'cleared',
            'related_transaction_id' => null,
            'narration' => $narration,
            'is_recurring' => false,
            'fiscal_year' => now()->year,
            'accounting_period' => now()->format('Y-m'),
            'is_adjusting_entry' => false,
            'cost_center_id' => null,
            'created_at' => now(),
            'updated_at' => now(),
            'created_by' => $userId,
            'updated_by' => $userId,
        ]);
    }

    private function createRepaymentLeg(
        Loan $loan,
        string $type,
        float $amount,
        string $currency,
        ?int $debitAccountId,
        ?int $creditAccountId,
        string $narration,
        int $userId,
        CommonService $commonService,
        ?int $chartOfAccount = null
    ): Transaction {
        $date = now()->toDateString();
        $exchangeRate = $this->fxRate($loan);

        return app(TransactionService::class)->create([
            'transaction_number' => $commonService->generateUniqueCode('TRX-'),
            'transaction_type' => $type,
            'transaction_date' => $date,
            'posted_date' => $date,
            'amount' => $amount,
            'base_currency' => $currency,
            'tax_amount' => 0,
            'net_amount' => $amount,
            'transaction_currency' => $currency,
            'exchange_rate' => $exchangeRate,
            'converted_amount' => round($amount * $exchangeRate, 2),
            'converted_tax_amount' => 0,
            'converted_net_amount' => round($amount * $exchangeRate, 2),
            'customer_id' => null,
            'company_id' => null,
            'source_type' => 'loan_repayment',
            'source_id' => $loan->id,
            'account_debit' => $debitAccountId,
            'account_credit' => $creditAccountId,
            // Trial-balance tag; falls back to the type-aware default.
            'chart_of_account' => $chartOfAccount,
            'category' => 'revenue',
            'payment_method' => 'CASH',
            'bank_account' => null,
            'check_number' => null,
            'transaction_status' => 'cleared',
            'related_transaction_id' => null,
            'narration' => $narration,
            'is_recurring' => false,
            'fiscal_year' => now()->year,
            'accounting_period' => now()->format('Y-m'),
            'is_adjusting_entry' => false,
            'cost_center_id' => null,
            'created_at' => now(),
            'updated_at' => now(),
            'created_by' => $userId,
            'updated_by' => $userId,
        ]);
    }

    /**
     * Mark schedule installments as paid/partial for the payment just
     * recorded. Interest-first, then principal, applied chronologically.
     * A single repayment may span many installments (early settlement or
     * over-installment payments), so per-installment applied amounts are
     * stored explicitly in loan_repayment_allocations.
     */
    private function updateScheduleAfterRepayment(Loan $loan, LoanRepayment $repayment, int $userId): void
    {
        $installments = $loan->schedule()
            ->whereIn('status', [LoanSchedule::STATUS_PENDING, LoanSchedule::STATUS_OVERDUE, LoanSchedule::STATUS_PARTIAL])
            ->orderBy('installment_number')
            ->get();

        $interestLeft = (float) $repayment->interest_component;
        $principalLeft = (float) $repayment->principal_component;

        $allocations = [];

        foreach ($installments as $installment) {
            if ($interestLeft <= 0 && $principalLeft <= 0) {
                break;
            }

            $alreadyInterest = $this->paidFor($installment, 'interest');
            $alreadyPrincipal = $this->paidFor($installment, 'principal');

            $interestDue = max((float) $installment->expected_interest - $alreadyInterest, 0);
            $principalDue = max((float) $installment->expected_principal - $alreadyPrincipal, 0);

            $interestApplied = round(min($interestLeft, $interestDue), 2);
            $principalApplied = round(min($principalLeft, $principalDue), 2);

            if ($interestApplied <= 0 && $principalApplied <= 0) {
                continue;
            }

            $newPaidInterest = round($alreadyInterest + $interestApplied, 2);
            $newPaidPrincipal = round($alreadyPrincipal + $principalApplied, 2);

            // Principal fully settled?
            $principalSettled = $newPaidPrincipal >= (float) $installment->expected_principal - 0.005;

            // Interest settled = either paid up, OR simply not fallen due
            // yet: for an installment still in the future, un-collected
            // interest is not "owed" — it is cancelled when the loan closes
            // (or re-earned monthly as time passes). Requiring future
            // interest in this check wrongly marks principal-settled rows
            // as partial.
            $interestSettled = $installment->due_date->lte(now())
                ? $newPaidInterest >= (float) $installment->expected_interest - 0.005
                : true;

            $fullyPaid = $principalSettled && $interestSettled;

            // Interest applied reduces the P&L: interest-only allocations
            // carry the expense chart (5000) and principal-only allocations
            // carry the liability chart (2000). A single installment can
            // receive both components, so mixed allocations are split into
            // two rows to keep the trial balance exact per component.
            $allocationFxRate = $this->fxRate($loan);
            $baseAllocation = [
                'loan_id' => $loan->id,
                'repayment_id' => $repayment->id,
                'schedule_installment_id' => $installment->id,
                'created_at' => now(),
                'created_by' => $userId,
            ];

            if ($interestApplied > 0) {
                $allocations[] = array_merge($baseAllocation, [
                    'interest_applied' => $interestApplied,
                    'interest_applied_kes' => round($interestApplied * $allocationFxRate, 2),
                    'principal_applied' => 0,
                    'principal_applied_kes' => 0,
                    'chart_of_account' => Transaction::expenseChartId(),
                ]);
            }

            if ($principalApplied > 0) {
                $allocations[] = array_merge($baseAllocation, [
                    'interest_applied' => 0,
                    'interest_applied_kes' => 0,
                    'principal_applied' => $principalApplied,
                    'principal_applied_kes' => round($principalApplied * $allocationFxRate, 2),
                    'chart_of_account' => $loan->chart_of_account,
                ]);
            }

            $installment->status = $fullyPaid
                ? LoanSchedule::STATUS_PAID
                : LoanSchedule::STATUS_PARTIAL;

            $installment->updated_at = now();
            $installment->updated_by = $userId;
            $installment->save();

            $interestLeft = round($interestLeft - $interestApplied, 2);
            $principalLeft = round($principalLeft - $principalApplied, 2);
        }

        if (! empty($allocations)) {
            DB::table('loan_repayment_allocations')->insert($allocations);
        }
    }

    private function paidFor(LoanSchedule $installment, string $component): float
    {
        return round(
            (float) DB::table('loan_repayment_allocations')
                ->where('schedule_installment_id', $installment->id)
                ->sum($component === 'interest' ? 'interest_applied' : 'principal_applied'),
            2
        );
    }
}
