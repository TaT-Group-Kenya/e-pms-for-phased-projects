<?php

namespace Tests\Feature;

use App\Models\AccountingPeriod;
use App\Models\AccountingPeriodLog;
use App\Models\AccountingPeriodRequest;
use App\Models\User;
use App\Services\AccountingPeriodService;
use App\Services\Concerns\PeriodLock;
use Illuminate\Support\Facades\Gate;
use Tests\TestCase;

/**
 * Maker/checker (four-eyes) workflow for accounting periods:
 *  - makers submit close/reopen requests;
 *  - a DIFFERENT checker approves (executes) or rejects;
 *  - maker==checker is always blocked;
 *  - approval of a close produces exactly one snapshot + one audit entry.
 */
class AccountingPeriodMakerCheckerTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        PeriodLock::withoutChecking(function () {
            $this->dropAllTables();
            $this->createSchema();
        });
    }

    protected function tearDown(): void
    {
        PeriodLock::withoutChecking(function () {
            $this->dropAllTables();
        });

        parent::tearDown();
    }

    private function dropAllTables(): void
    {
        foreach ([
            'accounting_period_requests',
            'accounting_period_logs',
            'accounting_periods',
            'trial_balance_run_lines',
            'trial_balance_runs',
            'chart_of_accounts',
            'accounts',
            'transactions',
            'customer_transactions_ledger',
            'company_transactions_ledger',
            'quotations',
            'user_groups',
            'group_roles',
            'sys_roles',
            'sys_groups',
            'users',
            'sys_configs',
            'migrations',
        ] as $table) {
            \Schema::dropIfExists($table);
        }
    }

    private function createSchema(): void
    {
        \Schema::create('users', function ($t) {
            $t->id();
            $t->timestamps();
            $t->string('email')->nullable();
            $t->string('category')->default('internal');
            $t->boolean('is_active')->default(true);
        });
        \Schema::create('sys_groups', fn ($t) => $this->logicalTable($t));
        \Schema::create('sys_roles', fn ($t) => $this->logicalTable($t));
        \Schema::create('group_roles', function ($t) {
            $t->id();
            $t->unsignedBigInteger('group_id');
            $t->unsignedBigInteger('role_id');
            $t->timestamps();
            $t->boolean('is_deleted')->default(false);
        });
        \Schema::create('user_groups', function ($t) {
            $t->id();
            $t->unsignedBigInteger('user_id');
            $t->unsignedBigInteger('sys_group_id');
            $t->timestamps();
            $t->boolean('is_deleted')->default(false);
        });
        \Schema::create('chart_of_accounts', function ($t) {
            $t->id();
            $t->string('code')->unique();
            $t->string('name')->nullable();
            $t->timestamps();
            $t->boolean('is_deleted')->default(false);
        });
        \DB::table('chart_of_accounts')->insert([
            ['code' => '1000', 'name' => 'Assets', 'is_deleted' => false],
            ['code' => '2000', 'name' => 'Liabilities', 'is_deleted' => false],
            ['code' => '4000', 'name' => 'Revenue', 'is_deleted' => false],
            ['code' => '5000', 'name' => 'Expenses', 'is_deleted' => false],
        ]);
        \Schema::create('accounts', function ($t) {
            $t->id();
            $t->string('name')->nullable();
            $t->timestamps();
            $t->unsignedBigInteger('chart_of_account_id')->nullable();
            $t->decimal('balance', 15, 2)->default(0);
            $t->string('currency')->default('KES');
            $t->boolean('is_deleted')->default(false);
        });
        \Schema::create('transactions', function ($t) {
            $t->id();
            $t->string('transaction_type')->nullable();
            $t->string('source_type')->nullable();
            $t->unsignedBigInteger('source_id')->nullable();
            $t->date('transaction_date')->nullable();
            $t->date('posted_date')->nullable();
            $t->decimal('amount', 15, 2)->default(0);
            $t->decimal('exchange_rate', 15, 6)->default(1);
            $t->string('transaction_currency', 10)->default('KES');
            $t->unsignedBigInteger('account_debit')->nullable();
            $t->string('narration')->nullable();
            $t->unsignedBigInteger('chart_of_account')->nullable();
            $t->unsignedBigInteger('customer_id')->nullable();
            $t->unsignedBigInteger('company_id')->nullable();
            $t->string('source_table')->nullable();
            $t->timestamps();
            $t->boolean('is_deleted')->default(false);
        });
        \Schema::create('customer_transactions_ledger', function ($t) {
            $t->id();
            $t->string('transaction_type')->nullable();
            $t->string('source_type')->nullable();
            $t->unsignedBigInteger('source_id')->nullable();
            $t->date('transaction_date')->nullable();
            $t->decimal('amount', 15, 2)->default(0);
            $t->decimal('tax_amount', 15, 2)->default(0);
            $t->decimal('net_amount', 15, 2)->default(0);
            $t->decimal('exchange_rate', 15, 6)->default(1);
            $t->string('transaction_currency', 10)->nullable();
            $t->string('narration')->nullable();
            $t->unsignedBigInteger('chart_of_account')->nullable();
            $t->unsignedBigInteger('cust_payment_id')->nullable();
            $t->string('transaction_number')->nullable();
            $t->unsignedBigInteger('customer_id')->nullable();
            $t->unsignedBigInteger('invoice_id')->nullable();
            $t->unsignedBigInteger('cust_invoice_id')->nullable();
            $t->timestamps();
            $t->boolean('is_deleted')->default(false);
        });
        \Schema::create('company_transactions_ledger', function ($t) {
            $t->id();
            $t->string('transaction_type')->nullable();
            $t->string('source_type')->nullable();
            $t->unsignedBigInteger('source_id')->nullable();
            $t->date('transaction_date')->nullable();
            $t->decimal('amount', 15, 2)->default(0);
            $t->decimal('tax_amount', 15, 2)->default(0);
            $t->decimal('net_amount', 15, 2)->default(0);
            $t->decimal('exchange_rate', 15, 6)->default(1);
            $t->string('transaction_currency', 10)->nullable();
            $t->string('narration')->nullable();
            $t->unsignedBigInteger('chart_of_account')->nullable();
            $t->unsignedBigInteger('company_payment_id')->nullable();
            $t->string('transaction_number')->nullable();
            $t->unsignedBigInteger('company_id')->nullable();
            $t->unsignedBigInteger('invoice_id')->nullable();
            $t->unsignedBigInteger('company_invoice_id')->nullable();
            $t->timestamps();
            $t->boolean('is_deleted')->default(false);
        });
        \Schema::create('quotations', function ($t) {
            $t->id();
            $t->string('title')->nullable();
            $t->string('status')->default('draft');
            $t->date('valid_until_date')->nullable();
            $t->string('currency')->default('KES');
            $t->timestamps();
            $t->unsignedBigInteger('created_by')->nullable();
            $t->unsignedBigInteger('updated_by')->nullable();
            $t->boolean('is_deleted')->default(false);
        });
        \Schema::create('trial_balance_runs', function ($t) {
            $t->id();
            $t->string('run_number')->unique();
            $t->date('as_at_date');
            $t->decimal('forex_rate', 15, 6);
            $t->string('base_currency', 10)->default('KES');
            $t->string('trigger', 20)->default('manual');
            $t->unsignedBigInteger('accounting_period_id')->nullable();
            $t->unsignedBigInteger('created_by')->nullable();
            $t->timestamps();
            $t->boolean('is_deleted')->default(false);
        });
        \Schema::create('trial_balance_run_lines', function ($t) {
            $t->id();
            $t->unsignedBigInteger('trial_balance_run_id');
            $t->unsignedBigInteger('chart_of_account');
            $t->string('category');
            $t->string('source_table');
            $t->string('source_type')->nullable();
            $t->unsignedBigInteger('source_id')->nullable();
            $t->unsignedBigInteger('account_id')->nullable();
            $t->decimal('debit_kes', 15, 2)->default(0);
            $t->decimal('credit_kes', 15, 2)->default(0);
            $t->decimal('debit_usd', 15, 2)->default(0);
            $t->decimal('credit_usd', 15, 2)->default(0);
            $t->text('description')->nullable();
            $t->timestamps();
        });
        \Schema::create('accounting_periods', function ($t) {
            $t->id();
            $t->enum('period_type', ['year', 'quarter', 'month']);
            $t->unsignedSmallInteger('fiscal_year');
            $t->unsignedTinyInteger('quarter')->nullable();
            $t->unsignedTinyInteger('month')->nullable();
            $t->string('name');
            $t->date('start_date');
            $t->date('end_date');
            $t->enum('status', ['open', 'closed'])->default('open');
            $t->timestamp('closed_at')->nullable();
            $t->unsignedBigInteger('closed_by')->nullable();
            $t->timestamp('closed_at_snapshot')->nullable();
            $t->timestamp('reopened_at')->nullable();
            $t->unsignedBigInteger('reopened_by')->nullable();
            $t->text('last_reopen_reason')->nullable();
            $t->unsignedBigInteger('created_by')->nullable();
            $t->unsignedBigInteger('updated_by')->nullable();
            $t->timestamps();
            $t->boolean('is_deleted')->default(false);
            $t->unique(['period_type', 'fiscal_year', 'quarter', 'month'], 'uq_ap_key');
        });
        \Schema::create('accounting_period_logs', function ($t) {
            $t->id();
            $t->unsignedBigInteger('accounting_period_id');
            $t->string('action');
            $t->unsignedBigInteger('performed_by')->nullable();
            $t->timestamp('performed_at');
            $t->text('reason')->nullable();
            $t->unsignedBigInteger('snapshot_run_id')->nullable();
            $t->timestamps();
        });
        \Schema::create('accounting_period_requests', function ($t) {
            $t->id();
            $t->unsignedBigInteger('accounting_period_id');
            $t->string('action');
            $t->enum('status', ['pending', 'approved', 'rejected', 'cancelled'])->default('pending');
            $t->unsignedBigInteger('requested_by');
            $t->timestamp('requested_at');
            $t->text('reason')->nullable();
            $t->decimal('forex_rate', 15, 6)->nullable();
            $t->string('checklist_summary', 1000)->nullable();
            $t->unsignedBigInteger('reviewed_by')->nullable();
            $t->timestamp('reviewed_at')->nullable();
            $t->text('review_note')->nullable();
            $t->unsignedBigInteger('executed_log_id')->nullable();
            $t->unsignedBigInteger('created_by')->nullable();
            $t->unsignedBigInteger('updated_by')->nullable();
            $t->timestamps();
        });
    }

    private function logicalTable($t): void
    {
        $t->id();
        $t->string('name')->nullable();
        $t->text('description')->nullable();
        $t->timestamps();
        $t->unsignedBigInteger('created_by')->nullable();
        $t->unsignedBigInteger('updated_by')->nullable();
        $t->boolean('is_deleted')->default(false);
        $t->timestamp('deleted_at')->nullable();
        $t->unsignedBigInteger('deleted_by')->nullable();
    }

    private function service(): AccountingPeriodService
    {
        return app(AccountingPeriodService::class);
    }

    private function pastPeriod(): AccountingPeriod
    {
        return $this->service()->ensureForDate(now()->subMonths(2)->format('Y-m-15'));
    }

    private function makeRequest(string $action = 'close', ?AccountingPeriod $period = null, int $makerId = 11): AccountingPeriodRequest
    {
        return $this->service()->submitRequest(
            $period ?? $this->pastPeriod(),
            $action,
            $makerId,
            $action === 'close' ? ['forex_rate' => 128.45] : ['reason' => 'correction needed'],
        );
    }

    // ---------------------------------------------------------------
    // Submission
    // ---------------------------------------------------------------

    public function test_maker_submits_close_request_pending(): void
    {
        $request = $this->makeRequest();

        $this->assertSame('pending', $request->status);
        $this->assertSame('close', $request->action);
        $this->assertEquals(128.45, $request->forex_rate);
        $this->assertNotNull($request->checklist_summary);
        $this->assertNull($request->reviewed_by);
    }

    public function test_duplicate_close_request_is_rejected(): void
    {
        $period = $this->pastPeriod();
        $this->makeRequest('close', $period, 11);

        $this->expectException(\App\Exceptions\PeriodLockedException::class);
        $this->makeRequest('close', $period, 12); // different maker, same period
    }

    public function test_close_request_requires_forex_rate(): void
    {
        $this->expectException(\App\Exceptions\PeriodLockedException::class);
        $this->service()->submitRequest($this->pastPeriod(), 'close', 11, []);
    }

    public function test_reopen_request_requires_reason(): void
    {
        $period = $this->pastPeriod();
        $this->service()->closeMonth($period, 128, 1);

        $this->expectException(\App\Exceptions\PeriodLockedException::class);
        $this->service()->submitRequest($period, 'reopen', 11, ['reason' => '  ']);
    }

    public function test_reopen_request_on_open_period_is_rejected(): void
    {
        $this->expectException(\App\Exceptions\PeriodLockedException::class);
        $this->makeRequest('reopen');
    }

    public function test_current_month_close_request_is_blocked(): void
    {
        $period = $this->service()->ensureForDate(now()->format('Y-m-15'));

        $this->expectException(\App\Exceptions\PeriodCloseNotAllowedException::class);
        $this->service()->submitRequest($period, 'close', 11, ['forex_rate' => 128]);
    }

    // ---------------------------------------------------------------
    // Approval
    // ---------------------------------------------------------------

    public function test_checker_approval_executes_close_with_snapshot(): void
    {
        $period = $this->pastPeriod();
        $request = $this->makeRequest('close', $period, 11);

        $approved = $this->service()->approveRequest($request, 22, 'Approved for month-end');

        $this->assertSame('approved', $approved->status);
        $this->assertSame(22, (int) $approved->reviewed_by);
        $this->assertSame('Approved for month-end', $approved->review_note);

        $period->refresh();
        $this->assertSame('closed', $period->status);
        $this->assertSame(22, (int) $period->closed_by); // checker executes

        // Snapshot exists exactly once, and the log links to the request.
        $this->assertSame(1, \App\Models\TrialBalanceRun::where('trigger', 'period_close')->count());
        $log = AccountingPeriodLog::where('accounting_period_id', $period->id)->first();
        $this->assertNotNull($log);
        $this->assertSame($approved->id, $log->request()->first()->id ?? null);
        $this->assertSame($approved->executed_log_id, $log->id);
        $this->assertSame($log->snapshot_run_id, $approved->id ? \App\Models\TrialBalanceRun::where('trigger', 'period_close')->value('id') : null);
    }

    public function test_maker_cannot_approve_own_request(): void
    {
        $request = $this->makeRequest('close', null, 33);

        try {
            $this->service()->approveRequest($request, 33, 'self');
            $this->fail('Expected PeriodLockedException');
        } catch (\App\Exceptions\PeriodLockedException $e) {
            $this->assertStringContainsString('different users', $e->getMessage());
        }

        $this->assertSame('pending', $request->fresh()->status);
    }

    public function test_already_reviewed_request_cannot_be_approved_again(): void
    {
        $request = $this->makeRequest();
        $this->service()->approveRequest($request, 22);

        $this->expectException(\App\Exceptions\PeriodLockedException::class);
        $this->service()->approveRequest($request, 23);
    }

    public function test_reopen_request_approval_reopens_with_reason(): void
    {
        $period = $this->pastPeriod();
        $this->service()->closeMonth($period, 128, 1);

        $request = $this->makeRequest('reopen', $period, 11);
        $this->service()->approveRequest($request, 22, 'ok');

        $period->refresh();
        $this->assertSame('open', $period->status);
        $this->assertSame('correction needed', $period->last_reopen_reason);
        $this->assertSame(22, (int) $period->reopened_by);

        // Two audit entries: close + reopen.
        $this->assertSame(2, AccountingPeriodLog::where('accounting_period_id', $period->id)->count());
    }

    // ---------------------------------------------------------------
    // Rejection / cancellation
    // ---------------------------------------------------------------

    public function test_rejection_requires_note_and_keeps_period_open(): void
    {
        $period = $this->pastPeriod();
        $request = $this->makeRequest('close', $period, 11);

        try {
            $this->service()->rejectRequest($request, 22, '');
            $this->fail('Expected rejection to require a note');
        } catch (\App\Exceptions\PeriodLockedException $e) {
            $this->assertStringContainsString('review note is required', $e->getMessage());
        }

        $rejected = $this->service()->rejectRequest($request, 22, 'Waiting for expense entries');

        $this->assertSame('rejected', $rejected->status);
        $this->assertSame(22, (int) $rejected->reviewed_by);
        $this->assertSame('Waiting for expense entries', $rejected->review_note);

        $this->assertSame('open', $period->fresh()->status);
        // No audit entry was written (nothing happened).
        $this->assertSame(0, AccountingPeriodLog::where('accounting_period_id', $period->id)->count());
    }

    public function test_maker_can_cancel_own_pending_request(): void
    {
        $request = $this->makeRequest('close', null, 44);
        $cancelled = $this->service()->cancelRequest($request, 44);

        $this->assertSame('cancelled', $cancelled->status);
        $this->assertSame('open', $this->pastPeriod()->fresh()->status);
    }

    public function test_other_user_cannot_cancel_request(): void
    {
        $request = $this->makeRequest('close', null, 44);

        $this->expectException(\App\Exceptions\PeriodLockedException::class);
        $this->service()->cancelRequest($request, 45);
    }

    public function test_cancelled_request_allows_new_submission(): void
    {
        $period = $this->pastPeriod();
        $first = $this->makeRequest('close', $period, 11);
        $this->service()->cancelRequest($first, 11);

        $second = $this->makeRequest('close', $period, 12);
        $this->assertSame('pending', $second->status);
    }
}
