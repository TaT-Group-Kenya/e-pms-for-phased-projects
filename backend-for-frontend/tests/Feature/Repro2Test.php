<?php

namespace Tests\Feature;

use App\Models\Loan;
use App\Models\User;
use App\Services\LoanService;
use Illuminate\Support\Facades\Gate;
use Tests\TestCase;

class Repro2Test extends TestCase
{
    public function test_repro2(): void
    {
        Gate::before(fn () => true);
        $user = new User;
        $user->id = 1;
        $this->actingAs($user, 'sanctum');

        $base = new \Tests\Feature\LoanTest('test_early_full_settlement_closes_loan_and_waives_future_installments');
        $rm = new \ReflectionMethod($base, 'createSchema');
        $rm->setAccessible(true);
        $dr = new \ReflectionMethod($base, 'dropAllTables');
        $dr->setAccessible(true);
        $dr->invoke($base);
        $rm->invoke($base);
        $mk = new \ReflectionMethod($base, 'makeLoanAccount');
        $mk->setAccessible(true);
        $mc = new \ReflectionMethod($base, 'makeCashAccount');
        $mc->setAccessible(true);
        $loanAccount = $mk->invoke($base);
        $cash = $mc->invoke($base, 1000000);

        $service = new LoanService;
        $loan = $service->createLoan([
            'account_id' => $loanAccount->id,
            'lender_name' => 'Early Bank',
            'principal' => 120000,
            'currency' => 'KES',
            'interest_type' => 'flat',
            'interest_rate' => 12,
            'tenure_months' => 12,
            'repayment_frequency' => 'monthly',
            'disbursement_date' => now()->toDateString(),
            'first_payment_date' => now()->addMonthsNoOverflow(6)->toDateString(),
        ], 1);

        $svc = new LoanService;
        $accrued = $svc->accruedInterest($loan->fresh());
        fwrite(STDERR, 'accrued before repay: '.$accrued.PHP_EOL);

        $repayment = $service->repay($loan->fresh(), [
            'amount' => 120000,
            'paid_from_account_id' => $cash->id,
        ], 1);

        $loan->refresh();
        fwrite(STDERR, 'loan status: '.$loan->status.PHP_EOL);
        fwrite(STDERR, 'accrued after: '.$svc->accruedInterest($loan).PHP_EOL);
        foreach ($loan->schedule()->orderBy('installment_number')->get() as $i) {
            fwrite(STDERR, sprintf('inst %d: %s exp_int=%s exp_pr=%s%s', $i->installment_number, $i->status, $i->expected_interest, $i->expected_principal, PHP_EOL));
        }
        $this->assertTrue(true);
    }
}
