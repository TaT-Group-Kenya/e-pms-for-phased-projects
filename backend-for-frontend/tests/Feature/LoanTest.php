<?php

namespace Tests\Feature;

use App\Models\Account;
use App\Models\ChartOfAccount;
use App\Models\Download;
use App\Models\Loan;
use App\Models\LoanRepayment;
use App\Models\LoanSchedule;
use App\Models\Transaction;
use App\Models\User;
use App\Services\LoanService;
use Illuminate\Support\Facades\Gate;
use Tests\TestCase;

class LoanTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->dropAllTables();
        $this->createSchema();
    }

    protected function tearDown(): void
    {
        $this->dropAllTables();

        parent::tearDown();
    }

    private function dropAllTables(): void
    {
        foreach ([
            'loan_repayment_allocations',
            'loan_repayments',
            'loan_schedules',
            'loans',
            'transactions',
            'accounts',
            'chart_of_accounts',
            'user_groups',
            'group_roles',
            'sys_roles',
            'sys_groups',
            'users',
            'customer_transactions_ledger',
            'company_transactions_ledger',
            'sys_configs',
            'downloads',
        ] as $table) {
            \Schema::dropIfExists($table);
        }
    }

    private function createSchema(): void
    {
        \Schema::create('users', function ($table) {
            $table->id();
            $table->timestamps();
            $table->string('email');
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('password');
            $table->timestamp('email_verified_at')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->string('remember_token')->nullable();
            $table->string('avatar_pic')->nullable();
            $table->string('category');
            $table->boolean('is_active');
            $table->unsignedBigInteger('company_id')->nullable();
            $table->unsignedBigInteger('customer_id')->nullable();
        });

        \Schema::create('sys_groups', function ($table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });

        \Schema::create('sys_roles', function ($table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });

        \Schema::create('group_roles', function ($table) {
            $table->id();
            $table->unsignedBigInteger('group_id');
            $table->unsignedBigInteger('role_id');
            $table->timestamps();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });

        \Schema::create('user_groups', function ($table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('sys_group_id');
            $table->timestamps();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });

        \Schema::create('chart_of_accounts', function ($table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });

        foreach ([
            ['code' => '1000', 'name' => 'Assets'],
            ['code' => '2000', 'name' => 'Liabilities'],
            ['code' => '3000', 'name' => 'Equity'],
            ['code' => '4000', 'name' => 'Revenue/Income'],
            ['code' => '5000', 'name' => 'Expenses'],
        ] as $seed) {
            ChartOfAccount::create($seed + ['description' => $seed['name']]);
        }

        \Schema::create('sys_configs', function ($table) {
            $table->id();
            $table->string('name');
            $table->string('value')->nullable();
            $table->boolean('readonly')->default(false);
            $table->boolean('is_file')->default(false);
        });

        \Schema::create('downloads', function ($table) {
            $table->id();
            $table->string('name');
            $table->string('path')->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });

        // Minimal ledger tables: the account statement endpoint unions these
        // with the transactions table.
        \Schema::create('customer_transactions_ledger', function ($table) {
            $table->id();
            $table->string('transaction_number')->nullable();
            $table->string('transaction_type')->nullable();
            $table->date('transaction_date')->nullable();
            $table->date('posted_date')->nullable();
            $table->string('transaction_currency')->nullable();
            $table->string('base_currency')->nullable();
            $table->decimal('amount', 15, 2)->default(0);
            $table->decimal('converted_amount', 15, 2)->nullable();
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('net_amount', 15, 2)->nullable();
            $table->decimal('converted_tax_amount', 15, 2)->nullable();
            $table->decimal('converted_net_amount', 15, 2)->nullable();
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->string('source_type')->nullable();
            $table->unsignedBigInteger('source_id')->nullable();
            $table->string('account_debit')->nullable();
            $table->string('account_credit')->nullable();
            $table->string('category')->nullable();
            $table->string('transaction_status')->nullable();
            $table->text('narration')->nullable();
            $table->boolean('is_recurring')->default(false);
            $table->string('fiscal_year')->nullable();
            $table->string('accounting_period')->nullable();
            $table->boolean('is_adjusting_entry')->default(false);
            $table->unsignedBigInteger('cost_center_id')->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });

        \Schema::create('company_transactions_ledger', function ($table) {
            $table->id();
            $table->string('transaction_number')->nullable();
            $table->string('transaction_type')->nullable();
            $table->date('transaction_date')->nullable();
            $table->date('posted_date')->nullable();
            $table->string('transaction_currency')->nullable();
            $table->string('base_currency')->nullable();
            $table->decimal('amount', 15, 2)->default(0);
            $table->decimal('converted_amount', 15, 2)->nullable();
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('net_amount', 15, 2)->nullable();
            $table->decimal('converted_tax_amount', 15, 2)->nullable();
            $table->decimal('converted_net_amount', 15, 2)->nullable();
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->unsignedBigInteger('company_id')->nullable();
            $table->string('source_type')->nullable();
            $table->unsignedBigInteger('source_id')->nullable();
            $table->string('account_debit')->nullable();
            $table->string('account_credit')->nullable();
            $table->string('category')->nullable();
            $table->string('transaction_status')->nullable();
            $table->text('narration')->nullable();
            $table->boolean('is_recurring')->default(false);
            $table->string('fiscal_year')->nullable();
            $table->string('accounting_period')->nullable();
            $table->boolean('is_adjusting_entry')->default(false);
            $table->unsignedBigInteger('cost_center_id')->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });

        \Schema::create('accounts', function ($table) {
            $table->id();
            $table->string('code');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('type');
            $table->string('group');
            $table->string('currency', 10)->nullable();
            $table->decimal('balance', 15, 2)->default(0);
            $table->boolean('overdraft_allowed')->default(false);
            $table->unsignedBigInteger('chart_of_account_id')->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->foreign('chart_of_account_id')->references('id')->on('chart_of_accounts');
        });

        \Schema::create('transactions', function ($table) {
            $table->id();
            $table->string('transaction_number');
            $table->string('transaction_type');
            $table->date('transaction_date');
            $table->date('posted_date');
            $table->decimal('amount', 15, 2);
            $table->string('transaction_currency')->nullable();
            $table->string('base_currency')->nullable();
            $table->decimal('exchange_rate', 15, 6)->default(1);
            $table->decimal('converted_amount', 15, 2)->nullable();
            $table->decimal('converted_tax_amount', 15, 2)->nullable();
            $table->decimal('converted_net_amount', 15, 2)->nullable();
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('net_amount', 15, 2)->nullable();
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->unsignedBigInteger('company_id')->nullable();
            $table->string('source_type');
            $table->unsignedBigInteger('source_id')->nullable();
            $table->string('account_debit')->nullable();
            $table->string('account_credit')->nullable();
            $table->string('category')->nullable();
            $table->string('payment_method')->nullable();
            $table->string('bank_account')->nullable();
            $table->string('check_number')->nullable();
            $table->string('transaction_status')->nullable();
            $table->unsignedBigInteger('related_transaction_id')->nullable();
            $table->text('narration')->nullable();
            $table->boolean('is_recurring')->default(false);
            $table->string('fiscal_year')->nullable();
            $table->string('accounting_period')->nullable();
            $table->boolean('is_adjusting_entry')->default(false);
            $table->unsignedBigInteger('cost_center_id')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });

        \Schema::create('loans', function ($table) {
            $table->id();
            $table->unsignedBigInteger('account_id');
            $table->string('lender_name');
            $table->decimal('principal', 15, 2);
            $table->string('currency', 10);
            $table->string('interest_type')->default('none');
            $table->decimal('interest_rate', 8, 4)->default(0);
            $table->unsignedInteger('tenure_months')->default(1);
            $table->string('repayment_frequency')->default('monthly');
            $table->date('disbursement_date');
            $table->date('first_payment_date')->nullable();
            $table->decimal('installment_amount', 15, 2)->nullable();
            $table->string('status')->default('pending_disbursement');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('disbursement_transaction_id')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->foreign('account_id')->references('id')->on('accounts');
            $table->foreign('disbursement_transaction_id')->references('id')->on('transactions');
        });

        \Schema::create('loan_schedules', function ($table) {
            $table->id();
            $table->unsignedBigInteger('loan_id');
            $table->unsignedInteger('installment_number');
            $table->date('due_date');
            $table->decimal('expected_principal', 15, 2)->default(0);
            $table->decimal('expected_interest', 15, 2)->default(0);
            $table->string('status')->default('pending');
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->foreign('loan_id')->references('id')->on('loans');
            $table->unique(['loan_id', 'installment_number']);
        });

        \Schema::create('loan_repayments', function ($table) {
            $table->id();
            $table->unsignedBigInteger('loan_id');
            $table->unsignedBigInteger('transaction_id')->nullable();
            $table->unsignedBigInteger('schedule_installment_id')->nullable();
            $table->date('payment_date');
            $table->decimal('amount_paid', 15, 2);
            $table->decimal('principal_component', 15, 2)->default(0);
            $table->decimal('interest_component', 15, 2)->default(0);
            $table->decimal('balance_after', 15, 2)->nullable();
            $table->unsignedBigInteger('paid_from_account_id')->nullable();
            $table->string('payment_reference')->nullable();
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->foreign('loan_id')->references('id')->on('loans');
            $table->foreign('transaction_id')->references('id')->on('transactions');
            $table->foreign('schedule_installment_id')->references('id')->on('loan_schedules');
            $table->foreign('paid_from_account_id')->references('id')->on('accounts');
        });

        \Schema::create('loan_repayment_allocations', function ($table) {
            $table->id();
            $table->unsignedBigInteger('loan_id');
            $table->unsignedBigInteger('repayment_id');
            $table->unsignedBigInteger('schedule_installment_id');
            $table->decimal('interest_applied', 15, 2)->default(0);
            $table->decimal('principal_applied', 15, 2)->default(0);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->foreign('loan_id')->references('id')->on('loans');
            $table->foreign('repayment_id')->references('id')->on('loan_repayments');
            $table->foreign('schedule_installment_id')->references('id')->on('loan_schedules');
        });
    }

    private function makeLoanAccount(array $overrides = []): Account
    {
        return Account::create(array_merge([
            'code' => 'INT-ACC-LOAN-'.uniqid(),
            'name' => 'Loan account',
            'description' => 'Loan account',
            'type' => 'bank',
            'group' => 'Loans',
            'currency' => 'KES',
            'balance' => 0,
            'overdraft_allowed' => false,
            'chart_of_account_id' => ChartOfAccount::where('code', '2000')->value('id'),
        ], $overrides));
    }

    private function makeCashAccount(float $balance = 100000): Account
    {
        return Account::create([
            'code' => 'INT-ACC-CASH-'.uniqid(),
            'name' => 'Main cash',
            'description' => 'Main cash',
            'type' => 'bank',
            'group' => 'Checking',
            'currency' => 'KES',
            'balance' => $balance,
            'overdraft_allowed' => false,
            'chart_of_account_id' => ChartOfAccount::where('code', '1000')->value('id'),
        ]);
    }

    private function authorizeAll(): void
    {
        Gate::before(fn () => true);
        $user = new User;
        $user->id = 1;
        $this->actingAs($user, 'sanctum');
    }

    public function test_manual_topup_is_rejected_for_loan_accounts(): void
    {
        $this->authorizeAll();

        $loanAccount = $this->makeLoanAccount();

        $response = $this->postJson('/e-pms/api/v1/accounts/'.$loanAccount->id.'/topup', [
            'source_type' => 'external',
            'external_source_description' => 'Direct funding',
            'amount' => 5000,
        ]);

        $response->assertStatus(422);
        $loanAccount->refresh();
        $this->assertEqualsWithDelta(0.0, (float) $loanAccount->balance, 0.01);
        $this->assertDatabaseCount('transactions', 0);

        // Internal source top-ups are equally rejected.
        $cash = $this->makeCashAccount(50000);
        $response2 = $this->postJson('/e-pms/api/v1/accounts/'.$loanAccount->id.'/topup', [
            'source_type' => 'internal',
            'source_account_id' => $cash->id,
            'source_debit_amount' => 1000,
        ]);

        $response2->assertStatus(422);
        $loanAccount->refresh();
        $this->assertEqualsWithDelta(0.0, (float) $loanAccount->balance, 0.01);
    }

    public function test_statement_meta_includes_loans_totals(): void
    {
        $this->authorizeAll();
        Gate::before(fn () => true);

        $loanAccount = $this->makeLoanAccount();
        $cash = $this->makeCashAccount(1000000);
        $service = new LoanService;

        $loan = $service->createLoan([
            'account_id' => $loanAccount->id,
            'lender_name' => 'E2E Bank',
            'principal' => 100000,
            'currency' => 'KES',
            'interest_type' => 'none',
            'interest_rate' => 0,
            'tenure_months' => 10,
            'repayment_frequency' => 'monthly',
            'disbursement_date' => now()->toDateString(),
        ], 1);

        $service->repay($loan->fresh(), [
            'amount' => 20000,
            'paid_from_account_id' => $cash->id,
        ], 1);

        $response = $this->getJson('/e-pms/api/v1/accounts/'.$loanAccount->id.'/statement');

        $response->assertOk();
        $totals = $response->json('meta.loans_totals');

        $this->assertNotNull($totals);
        $this->assertSame(1, (int) $totals['loan_count']);
        $this->assertEqualsWithDelta(100000.0, (float) $totals['total_borrowed'], 0.01);
        // 100k disbursed, 20k repaid.
        $this->assertEqualsWithDelta(80000.0, (float) $totals['total_outstanding'], 0.01);
        $this->assertEqualsWithDelta(20000.0, (float) $totals['total_repaid'], 0.01);
        $this->assertEqualsWithDelta(0.0, (float) $totals['total_interest_repaid'], 0.01);
        $this->assertNotNull($totals['next_due_date']);
        $this->assertEqualsWithDelta(10000.0, (float) $totals['next_due_amount'], 0.01);
    }

    public function test_repayment_of_200_on_1000_24m_marking(): void
    {
        // Regression for the reported case: a 200 repayment on a 1,000 /
        // 24-month / 12.5% monthly loan must NOT mark untouched installments
        // as "partial" merely because their future interest was not paid.
        $this->authorizeAll();
        $service = new LoanService;

        $loanAccount = $this->makeLoanAccount();
        $cash = $this->makeCashAccount(100000);

        $loan = $service->createLoan([
            'account_id' => $loanAccount->id,
            'lender_name' => 'Reported Bank',
            'principal' => 1000,
            'currency' => 'USD',
            'interest_type' => 'reducing',
            'interest_rate' => 12.5,
            'tenure_months' => 24,
            'repayment_frequency' => 'monthly',
            'disbursement_date' => now()->toDateString(),
        ], 1);

        $loan->refresh();
        $this->assertEqualsWithDelta(47.31, (float) $loan->installment_amount, 0.01);

        // Only installment 1 has fallen due (first payment = today).
        $repayment = $service->repay($loan->fresh(), [
            'amount' => 200,
            'paid_from_account_id' => $cash->id,
        ], 1);

        $loan->refresh();

        // 200 buys ~4.23 installments of principal.
        $this->assertEqualsWithDelta(10.42, (float) $repayment->interest_component, 0.05);
        $this->assertEqualsWithDelta(189.58, (float) $repayment->principal_component, 0.05);
        $this->assertEqualsWithDelta(810.42, (float) $repayment->balance_after, 0.05);

        // First five installments fully settle (principal met; their future
        // interest cancelled), the sixth is partial, the remaining 18 stay
        // pending.
        $this->assertSame(5, $loan->schedule()->where('status', 'paid')->count());
        $this->assertSame(1, $loan->schedule()->where('status', 'partial')->count());
        $this->assertSame(18, $loan->schedule()->where('status', 'pending')->count());
    }

    public function test_loans_totals_are_zero_for_regular_accounts(): void
    {
        $this->authorizeAll();

        $cash = $this->makeCashAccount();

        $response = $this->getJson('/e-pms/api/v1/accounts/'.$cash->id.'/statement');

        $response->assertOk();
        $totals = $response->json('meta.loans_totals');

        $this->assertNotNull($totals);
        $this->assertSame(0, (int) $totals['loan_count']);
        $this->assertEqualsWithDelta(0.0, (float) $totals['total_outstanding'], 0.01);
    }

    public function test_loan_statement_pdf_downloads(): void
    {
        $this->authorizeAll();
        $service = new LoanService;

        $loanAccount = $this->makeLoanAccount();
        $service->createLoan([
            'account_id' => $loanAccount->id,
            'lender_name' => 'PDF Bank',
            'principal' => 50000,
            'currency' => 'KES',
            'interest_type' => 'flat',
            'interest_rate' => 12,
            'tenure_months' => 12,
            'repayment_frequency' => 'monthly',
            'disbursement_date' => now()->toDateString(),
        ], 1);

        $loan = Loan::orderByDesc('id')->first();

        $response = $this->getJson('/e-pms/api/v1/loans/'.$loan->id.'/statement-pdf');

        $response->assertOk();
        $this->assertSame('application/pdf', $response->headers->get('Content-Type'));

        // streamDownload content is not captured by getJson(); verify the
        // rendered output through the stored download artifact instead.
        $download = Download::where('name', 'loan-statement:'.$loan->id)->first();
        $this->assertNotNull($download);
        \Storage::disk('public')->assertExists($download->path);
        $this->assertStringContainsString(
            '%PDF',
            substr(\Storage::disk('public')->get($download->path), 0, 8)
        );
    }

    public function test_installment_math_none_flat_and_reducing(): void
    {
        $service = new LoanService;

        // No interest: 100k over 10 months = 10,000.
        $this->assertEqualsWithDelta(10000.0, $service->computeInstallment(100000, 'none', 0, 10, 'monthly'), 0.01);

        // Flat 12% p.a. over 12 months (p/y = 12): interest 12,000 => 93,333.33/mo...
        // total = 112,000 / 12 = 9,333.33.
        $this->assertEqualsWithDelta(9333.33, $service->computeInstallment(100000, 'flat', 12, 12, 'monthly'), 0.02);

        // Reducing 12% p.a., 12 months on 100k => standard annuity 8,884.88.
        $this->assertEqualsWithDelta(8884.88, $service->computeInstallment(100000, 'reducing', 12, 12, 'monthly'), 1.0);
    }

    public function test_loan_creation_funds_account_transactionally(): void
    {
        $this->authorizeAll();
        $service = new LoanService;

        $account = $this->makeLoanAccount();

        $loan = $service->createLoan([
            'account_id' => $account->id,
            'lender_name' => 'ABC Bank',
            'principal' => 75000,
            'currency' => 'KES',
            'interest_type' => 'none',
            'interest_rate' => 0,
            'tenure_months' => 6,
            'repayment_frequency' => 'monthly',
            'disbursement_date' => now()->toDateString(),
        ], 1);

        $account->refresh();
        $loan->refresh();

        // Loan is born active: funded immediately on creation.
        $this->assertSame(Loan::STATUS_ACTIVE, $loan->status);
        $this->assertNotNull($loan->disbursement_transaction_id);

        // Cash moves immediately; the obligation lives on the loan.
        $this->assertEqualsWithDelta(75000.0, $service->outstandingBalance($loan->fresh()), 0.01);
        $this->assertEqualsWithDelta(75000.0, (float) $account->balance, 0.01);

        // Ledger entry exists with the required narration, crediting the loan account.
        $this->assertDatabaseHas('transactions', [
            'source_type' => 'loan_disbursement',
            'source_id' => $loan->id,
            'account_credit' => (string) $account->id,
            'amount' => 75000.0,
            'narration' => 'top up from loan '.$loan->id,
        ]);

        // Schedule is part of the same commit.
        $this->assertSame(6, $loan->schedule()->count());
    }

    public function test_failed_loan_creation_leaves_no_trace(): void
    {
        $this->authorizeAll();
        $service = new LoanService;

        $account = $this->makeLoanAccount();

        // Invalid terms tenure=0 makes computeInstallment throw after the
        // loan row is created; the transaction must roll everything back.
        try {
            $service->createLoan([
                'account_id' => $account->id,
                'lender_name' => 'Bad Loan',
                'principal' => 100,
                'currency' => 'KES',
                'interest_type' => 'none',
                'interest_rate' => 0,
                'tenure_months' => 0,
                'repayment_frequency' => 'monthly',
                'disbursement_date' => now()->toDateString(),
            ], 1);
            $this->fail('Zero-tenure loans must be rejected.');
        } catch (\Throwable $e) {
            // expected
        }

        $account->refresh();
        $this->assertEqualsWithDelta(0.0, (float) $account->balance, 0.01);
        $this->assertDatabaseCount('loans', 0);
        $this->assertDatabaseCount('loan_schedules', 0);
        $this->assertDatabaseMissing('transactions', [
            'source_type' => 'loan_disbursement',
        ]);
    }

    public function test_disbursement_credits_account_and_activates_loan(): void
    {
        $this->authorizeAll();
        $service = new LoanService;

        $account = $this->makeLoanAccount();
        $loan = $service->createLoan([
            'account_id' => $account->id,
            'lender_name' => 'ABC Bank',
            'principal' => 500000,
            'currency' => 'KES',
            'interest_type' => 'none',
            'interest_rate' => 0,
            'tenure_months' => 10,
            'repayment_frequency' => 'monthly',
            'disbursement_date' => now()->toDateString()
                ], 1);

        $loan->refresh();
        $account->refresh();

        $this->assertSame(Loan::STATUS_ACTIVE, $loan->status);
        $this->assertNotNull($loan->disbursement_transaction_id);
        // Funded at creation: cash on the account, obligation on the loan.
        $this->assertEqualsWithDelta(500000.0, $service->outstandingBalance($loan->fresh()), 0.01);
        $this->assertSame(500000.0, (float) $account->balance);
        $this->assertSame(10, $loan->schedule()->count());

        $this->assertDatabaseHas('transactions', [
            'source_type' => 'loan_disbursement',
            'source_id' => $loan->id,
            'account_credit' => (string) $account->id,
            'amount' => 500000.0,
        ]);

        // Schedule amortizes fully.
        $sumPrincipal = (float) $loan->schedule()->sum('expected_principal');
        $this->assertEqualsWithDelta(500000.0, $sumPrincipal, 0.05);
    }

    public function test_repayment_reduces_loan_balance_and_moves_cash(): void
    {
        $this->authorizeAll();
        $service = new LoanService;

        $loanAccount = $this->makeLoanAccount();
        $cash = $this->makeCashAccount(100000);

        $loan = $service->createLoan([
            'account_id' => $loanAccount->id,
            'lender_name' => 'ABC Bank',
            'principal' => 100000,
            'currency' => 'KES',
            'interest_type' => 'none',
            'interest_rate' => 0,
            'tenure_months' => 10,
            'repayment_frequency' => 'monthly',
            'disbursement_date' => now()->toDateString()
                ], 1);

        $repayment = $service->repay($loan->fresh(), [
            'amount' => 30000,
            'paid_from_account_id' => $cash->id,
            'payment_date' => now()->toDateString(),
        ], 1);

        $loanAccount->refresh();
        $cash->refresh();

        // No interest => whole repayment reduces principal (per loan).
        $this->assertEqualsWithDelta(70000.0, $service->outstandingBalance($loan->fresh()), 0.01);
        $this->assertEqualsWithDelta(70000.0, $repayment->balance_after, 0.01);
        $this->assertSame(0.0, (float) $repayment->interest_component);
        $this->assertEqualsWithDelta(30000.0, (float) $repayment->principal_component, 0.01);

        // Cash leaves the paying account to the lender; the loan account's
        // balance is untouched (it only holds disbursed loan cash).
        $this->assertEqualsWithDelta(70000.0, (float) $cash->balance, 0.01);
        // Disbursement credited 100k; repayment does NOT touch it.
        $this->assertEqualsWithDelta(100000.0, (float) $loanAccount->balance, 0.01);

        // One debit leg for the paying account; no credit leg on the loan account.
        $this->assertDatabaseHas('transactions', [
            'source_type' => 'loan_repayment',
            'account_debit' => (string) $cash->id,
            'amount' => 30000.0,
        ]);
        $this->assertDatabaseMissing('transactions', [
            'source_type' => 'loan_repayment',
            'account_credit' => (string) $loanAccount->id,
        ]);
    }

    public function test_early_full_settlement_closes_loan_and_waives_future_installments(): void
    {
        $this->authorizeAll();
        $service = new LoanService;

        $loanAccount = $this->makeLoanAccount();
        $cash = $this->makeCashAccount(1000000);

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
            // First payment far in the future => no installments have fallen
            // due yet, so zero interest is collectable: settling now repays
            // principal only.
            'first_payment_date' => now()->addMonthsNoOverflow(6)->toDateString(),
        ], 1);

        $loan->refresh();
        $this->assertSame(12, $loan->schedule()->count());

        // Settle the whole loan months early.
        $repayment = $service->repay($loan->fresh(), [
            'amount' => 120000,
            'paid_from_account_id' => $cash->id,
        ], 1);

        $loan->refresh();
        $loanAccount->refresh();

        $this->assertSame(Loan::STATUS_CLOSED, $loan->status);
        $this->assertEqualsWithDelta(0.0, $service->outstandingBalance($loan->fresh()), 0.01);
        $this->assertEqualsWithDelta(0.0, (float) $repayment->interest_component, 0.01);
        $this->assertEqualsWithDelta(120000.0, (float) $repayment->principal_component, 0.01);

        // Settlement before any installment fell due: principal repaid for
        // every installment; future interest is cancelled. All 12 rows are
        // paid (obligation met) and the loan closes — nothing pending.
        $this->assertSame(0, $loan->schedule()->whereIn('status', ['pending', 'overdue', 'partial'])->count());
        $this->assertSame(12, $loan->schedule()->where('status', 'paid')->count());

        // No further repayment possible after closure.
        $this->expectException(\InvalidArgumentException::class);
        $service->repay($loan->fresh(), [
            'amount' => 100,
            'paid_from_account_id' => $cash->id,
        ], 1);
    }

    public function test_repayment_larger_than_single_installment_advances_several(): void
    {
        $this->authorizeAll();
        $service = new LoanService;

        $loanAccount = $this->makeLoanAccount();
        $cash = $this->makeCashAccount(1000000);

        $loan = $service->createLoan([
            'account_id' => $loanAccount->id,
            'lender_name' => 'Lump Bank',
            'principal' => 10000,
            'currency' => 'KES',
            'interest_type' => 'none',
            'interest_rate' => 0,
            'tenure_months' => 10,
            'repayment_frequency' => 'monthly',
            'disbursement_date' => now()->toDateString(),
            'first_payment_date' => '2026-01-01', // long past: all due
        ], 1);

        // Pay 3.5 installments at once.
        $repayment = $service->repay($loan->fresh(), [
            'amount' => 3500,
            'paid_from_account_id' => $cash->id,
        ], 1);

        $loan->refresh();

        $this->assertEqualsWithDelta(6500.0, (float) $repayment->balance_after, 0.01);
        $this->assertSame(3, $loan->schedule()->where('status', 'paid')->count());
        $this->assertSame(1, $loan->schedule()->where('status', 'partial')->count());
        $this->assertSame(6, $loan->schedule()->where('status', 'pending')->count());

        // A second payment clears the partial installment and continues.
        $second = $service->repay($loan->fresh(), [
            'amount' => 1500,
            'paid_from_account_id' => $cash->id,
        ], 1);

        $loan->refresh();
        $this->assertEqualsWithDelta(5000.0, (float) $second->balance_after, 0.01);
        // Second payment clears the partial remainder (500) and pays the
        // next full installment (1000).
        $this->assertSame(5, $loan->schedule()->where('status', 'paid')->count());
    }

    public function test_early_month_settlement_of_long_loan_closes_cleanly(): void
    {
        $this->authorizeAll();
        $service = new LoanService;

        $loanAccount = $this->makeLoanAccount();
        $cash = $this->makeCashAccount(1000000);

        // 36-month loan at 8% flat: total interest 120. Monthly interest
        // instalment = 3.33; first 3 installments fall due immediately.
        $loan = $service->createLoan([
            'account_id' => $loanAccount->id,
            'lender_name' => 'Fast Bank',
            'principal' => 500,
            'currency' => 'KES',
            'interest_type' => 'flat',
            'interest_rate' => 8,
            'tenure_months' => 36,
            'repayment_frequency' => 'monthly',
            'disbursement_date' => now()->toDateString(),
            'first_payment_date' => '2026-01-01',
        ], 1);

        $loan->refresh();

        // Settle fully in month ~3: principal 500 + all fallen-due interest.
        $amount = round(500 + $service->accruedInterest($loan->fresh()), 2);
        $this->assertGreaterThan(500.0, $amount);

        $repayment = $service->repay($loan->fresh(), [
            'amount' => $amount,
            'paid_from_account_id' => $cash->id,
        ], 1);

        $loan->refresh();
        $loanAccount->refresh();

        $this->assertSame(Loan::STATUS_CLOSED, $loan->status);
        $this->assertEqualsWithDelta(0.0, $service->outstandingBalance($loan->fresh()), 0.01);
        $this->assertGreaterThan(0.0, (float) $repayment->interest_component);
        // Remaining (unreached) installments waived, none left owing.
        $this->assertSame(
            0,
            $loan->schedule()->whereIn('status', ['pending', 'partial', 'overdue'])->count()
        );
    }

    public function test_repayment_with_interest_settles_interest_first(): void
    {
        $this->authorizeAll();
        $service = new LoanService;

        $loanAccount = $this->makeLoanAccount();
        $cash = $this->makeCashAccount(200000);

        $loan = $service->createLoan([
            'account_id' => $loanAccount->id,
            'lender_name' => 'ABC Bank',
            'principal' => 120000,
            'currency' => 'KES',
            'interest_type' => 'flat',
            'interest_rate' => 12,
            'tenure_months' => 12,
            'repayment_frequency' => 'monthly',
            'disbursement_date' => now()->subMonthsNoOverflow(3)->startOfMonth()->toDateString(),
            // Anchor future-immunized: installments due on the 1st of each
            // month => exactly 4 installments have fallen due by today
            // (months -3, -2, -1 and current month start).
            'first_payment_date' => now()->subMonthsNoOverflow(3)->startOfMonth()->toDateString()
                ], 1);
        $loan->refresh();

        // Flat 12% p.a. over 1 year on 120k => total interest 14,400; per
        // installment interest 1,200.
        $first = $loan->schedule()->where('installment_number', 1)->first();
        $this->assertEqualsWithDelta(1200.0, (float) $first->expected_interest, 0.05);

        // Repay exactly one installment. The installment amount mirrors the
        // controller store flow: computed once, then persisted on the loan.
        $service2 = new LoanService;
        $installmentAmount = $service2->computeInstallment(120000, 'flat', 12, 12, 'monthly');
        $this->assertEqualsWithDelta(11200.0, $installmentAmount, 0.05);

        // Only fallen-due interest is collectable: 4 due installments x 1,200.
        $this->assertEqualsWithDelta(4800.0, $service->accruedInterest($loan->fresh()), 0.05);

        $repayment = $service->repay($loan->fresh(), [
            'amount' => $installmentAmount,
            'paid_from_account_id' => $cash->id,
        ], 1);

        // The loan record keeps the computed installment for display.
        $loan->installment_amount = $installmentAmount;
        $loan->updated_at = now();
        $loan->save();

        $loanAccount->refresh();

        // 4 due installments' interest (4,800) collected first; remainder
        // reduces principal.
        $this->assertEqualsWithDelta(4800.0, (float) $repayment->interest_component, 0.05);
        $this->assertEqualsWithDelta($installmentAmount - 4800.0, (float) $repayment->principal_component, 0.05);
        $this->assertEqualsWithDelta(
            120000.0 - ($installmentAmount - 4800.0),
            $service->outstandingBalance($loan->fresh()),
            0.05
        );

        $first->refresh();
        // Installment 1 collected 1,200 interest but only 6,400 of its
        // 10,000 principal (interest-first across due installments won),
        // so it is partially paid.
        $this->assertSame(LoanSchedule::STATUS_PARTIAL, $first->status);
    }

    public function test_schedule_generated_at_loan_creation_with_total_repayable(): void
    {
        $this->authorizeAll();
        $service = new LoanService;

        $account = $this->makeLoanAccount();

        // 500 @ 8% p.a. flat over 36 monthly installments:
        // total interest = 500 * 8% * (36/12) = 120 => repayable 620,
        // installment 620/36 = 17.22.
        $loan = $service->createLoan([
            'account_id' => $account->id,
            'lender_name' => 'Micro Lender',
            'principal' => 500,
            'currency' => 'KES',
            'interest_type' => 'flat',
            'interest_rate' => 8,
            'tenure_months' => 36,
            'repayment_frequency' => 'monthly',
            'disbursement_date' => '2026-04-01',
            'first_payment_date' => '2026-05-01',
        ], 1);

        $loan->refresh();

        // Schedule exists straight after addition, before disbursement.
        $this->assertSame(36, $loan->schedule()->count());
        $this->assertEqualsWithDelta(17.22, (float) $loan->installment_amount, 0.01);

        $summary = $service->summary($loan->fresh());
        // Per-installment 2dp rounding accumulates a few cents over 36 rows;
        // tolerancing keeps the test honest without weakening the contract.
        $this->assertEqualsWithDelta(120.0, (float) $summary['total_interest'], 0.5);
        $this->assertEqualsWithDelta(620.0, (float) $summary['total_repayable'], 0.5);
        $this->assertEqualsWithDelta(500.0, (float) $summary['loan_balance'], 0.01);
        // Next due came from the schedule generated at creation.
        $this->assertSame('2026-05-01', $summary['next_due_date']);
        $this->assertEqualsWithDelta(17.22, (float) $summary['next_due_amount'], 0.01);

        // Schedule amortizes fully to the principal (same rounding drift).
        $this->assertEqualsWithDelta(500.0, (float) $loan->schedule()->sum('expected_principal'), 0.5);
        $this->assertEqualsWithDelta(120.0, (float) $loan->schedule()->sum('expected_interest'), 0.5);
    }

    public function test_repayment_cannot_exceed_outstanding(): void
    {
        $this->authorizeAll();
        $service = new LoanService;

        $loanAccount = $this->makeLoanAccount();
        $cash = $this->makeCashAccount(1000000);

        $loan = $service->createLoan([
            'account_id' => $loanAccount->id,
            'lender_name' => 'ABC Bank',
            'principal' => 50000,
            'currency' => 'KES',
            'interest_type' => 'none',
            'interest_rate' => 0,
            'tenure_months' => 5,
            'repayment_frequency' => 'monthly',
            'disbursement_date' => now()->toDateString()
                ], 1);

        $this->expectException(\InvalidArgumentException::class);
        $service->repay($loan->fresh(), [
            'amount' => 60000,
            'paid_from_account_id' => $cash->id,
        ], 1);
    }

    public function test_full_repayment_closes_loan(): void
    {
        $this->authorizeAll();
        $service = new LoanService;

        $loanAccount = $this->makeLoanAccount();
        $cash = $this->makeCashAccount(1000000);

        $loan = $service->createLoan([
            'account_id' => $loanAccount->id,
            'lender_name' => 'ABC Bank',
            'principal' => 40000,
            'currency' => 'KES',
            'interest_type' => 'none',
            'interest_rate' => 0,
            'tenure_months' => 4,
            'repayment_frequency' => 'monthly',
            'disbursement_date' => now()->toDateString()
                ], 1);

        $service->repay($loan->fresh(), [
            'amount' => 40000,
            'paid_from_account_id' => $cash->id,
        ], 1);

        $loan->refresh();
        $loanAccount->refresh();

        $this->assertSame(Loan::STATUS_CLOSED, $loan->status);
        $this->assertEqualsWithDelta(0.0, $service->outstandingBalance($loan->fresh()), 0.01);
    }

    public function test_loan_store_request_rejects_non_loans_account(): void
    {
        $cash = $this->makeCashAccount();

        $request = new \App\Http\Requests\LoanStoreRequest;
        $request->setContainer(app());
        $request->merge([
            'account_id' => $cash->id,
            'lender_name' => 'ABC',
            'principal' => 1000,
            'currency' => 'KES',
            'interest_type' => 'none',
            'tenure_months' => 3,
            'repayment_frequency' => 'monthly',
            'disbursement_date' => now()->toDateString(),
        ]);

        $method = new \ReflectionMethod($request, 'getValidatorInstance');
        $validator = $method->invoke($request);

        $this->assertTrue($validator->fails());
        $this->assertTrue($validator->errors()->has('account_id'));
    }

    public function test_loan_store_request_rejects_mismatched_currency(): void
    {
        $loanAccount = $this->makeLoanAccount(['currency' => 'KES']);

        $request = new \App\Http\Requests\LoanStoreRequest;
        $request->setContainer(app());
        $request->merge([
            'account_id' => $loanAccount->id,
            'lender_name' => 'ABC',
            'principal' => 1000,
            'currency' => 'USD',
            'interest_type' => 'none',
            'tenure_months' => 3,
            'repayment_frequency' => 'monthly',
            'disbursement_date' => now()->toDateString(),
        ]);

        $method = new \ReflectionMethod($request, 'getValidatorInstance');
        $validator = $method->invoke($request);

        $this->assertTrue($validator->fails());
        $this->assertTrue($validator->errors()->has('currency'));
    }
}