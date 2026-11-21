<?php

namespace Tests\Feature;

use App\Models\AccountingPeriod;
use App\Models\AccountingPeriodLog;
use App\Models\ChartOfAccount;
use App\Models\TrialBalanceRun;
use App\Models\User;
use App\Services\AccountingPeriodService;
use App\Services\Concerns\PeriodLock;
use Carbon\Carbon;
use Tests\TestCase;

/**
 * HTTP-level coverage for the period APIs: index, show, checklist, close,
 * reopen, logs, and the permission boundaries (view/close/reopen).
 */
class AccountingPeriodApiTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        PeriodLock::withoutChecking(function () {
            $this->dropAllTables();
            $this->createSchema();
            $this->seedChart();
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
            'accounting_period_logs',
            'accounting_periods',
            'trial_balance_run_lines',
            'trial_balance_runs',
            'chart_of_accounts',
            'accounts',
            'transactions',
            'customer_transactions_ledger',
            'company_transactions_ledger',
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
        \Schema::create('accounts', function ($t) {
            $t->id();
            $t->string('name')->nullable();
            $t->timestamps();
            $t->unsignedBigInteger('chart_of_account_id')->nullable();
            $t->decimal('balance', 15, 2)->default(0);
            $t->string('currency')->default('KES');
            $t->boolean('is_deleted')->default(false);
        });
        // Ledgers/transactions (empty; read by TB generate).
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
            $t->unsignedBigInteger('cust_payment_id')->nullable();
            $t->string('transaction_number')->nullable();
            $t->string('transaction_type')->nullable();
            $t->string('source_type')->nullable();
            $t->unsignedBigInteger('source_id')->nullable();
            $t->date('transaction_date')->nullable();
            $t->date('posted_date')->nullable();
            $t->decimal('amount', 15, 2)->default(0);
            $t->decimal('tax_amount', 15, 2)->default(0);
            $t->decimal('net_amount', 15, 2)->default(0);
            $t->decimal('exchange_rate', 15, 6)->default(1);
            $t->string('transaction_currency', 10)->nullable();
            $t->string('narration')->nullable();
            $t->unsignedBigInteger('chart_of_account')->nullable();
            $t->unsignedBigInteger('customer_id')->nullable();
            $t->unsignedBigInteger('invoice_id')->nullable();
            $t->unsignedBigInteger('cust_invoice_id')->nullable();
            $t->timestamps();
            $t->boolean('is_deleted')->default(false);
        });
        \Schema::create('company_transactions_ledger', function ($t) {
            $t->id();
            $t->unsignedBigInteger('company_payment_id')->nullable();
            $t->string('transaction_number')->nullable();
            $t->string('transaction_type')->nullable();
            $t->string('source_type')->nullable();
            $t->unsignedBigInteger('source_id')->nullable();
            $t->date('transaction_date')->nullable();
            $t->date('posted_date')->nullable();
            $t->decimal('amount', 15, 2)->default(0);
            $t->decimal('tax_amount', 15, 2)->default(0);
            $t->decimal('net_amount', 15, 2)->default(0);
            $t->decimal('exchange_rate', 15, 6)->default(1);
            $t->string('transaction_currency', 10)->nullable();
            $t->string('narration')->nullable();
            $t->unsignedBigInteger('chart_of_account')->nullable();
            $t->unsignedBigInteger('company_id')->nullable();
            $t->unsignedBigInteger('invoice_id')->nullable();
            $t->unsignedBigInteger('company_invoice_id')->nullable();
            $t->timestamps();
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

    private function seedChart(): void
    {
        ChartOfAccount::insert([
            ['code' => '1000', 'name' => 'Assets', 'is_deleted' => false],
            ['code' => '2000', 'name' => 'Liabilities', 'is_deleted' => false],
            ['code' => '4000', 'name' => 'Revenue', 'is_deleted' => false],
            ['code' => '5000', 'name' => 'Expenses', 'is_deleted' => false],
        ]);
    }

    private function userWithRoles(array $roles): User
    {
        $user = new User;
        $user->id = random_int(10, 9999);
        $user->category = 'internal';

        $groupId = \DB::table('sys_groups')->insertGetId(['name' => 'G', 'created_at' => now(), 'updated_at' => now()]);
        \DB::table('user_groups')->insert(['user_id' => $user->id, 'sys_group_id' => $groupId]);
        foreach ($roles as $role) {
            $roleId = \DB::table('sys_roles')->insertGetId(['name' => $role, 'created_at' => now(), 'updated_at' => now()]);
            \DB::table('group_roles')->insert(['group_id' => $groupId, 'role_id' => $roleId]);
        }

        return $user;
    }

    private function periodFor(string $date): AccountingPeriod
    {
        return PeriodLock::withoutChecking(fn () => app(AccountingPeriodService::class)->ensureForDate($date));
    }

    public function test_index_returns_month_statuses(): void
    {
        $this->actingAs($this->userWithRoles(['ROLE_VIEW_ACCOUNTING_PERIOD']), 'sanctum');
        $this->periodFor('2026-11-01');

        $response = $this->getJson('/e-pms/api/v1/accounting-periods?fiscal_year=2026');
        $response->assertOk();
        $this->assertSame(2026, $response->json('fiscal_year'));
        $months = $response->json('months');
        $this->assertNotEmpty($months);
        // months[] is ordered by month number; find November by its field.
        $november = collect($months)->firstWhere('month', 11);
        $this->assertNotNull($november);
        $this->assertSame('open', $november['status']);
    }

    public function test_index_requires_view_permission(): void
    {
        $this->actingAs($this->userWithRoles([]), 'sanctum');
        $response = $this->getJson('/e-pms/api/v1/accounting-periods?fiscal_year=2026');
        $response->assertForbidden();
    }

    public function test_checklist_reports_stranded_drafts_and_rate(): void
    {
        $this->actingAs($this->userWithRoles(['ROLE_CLOSE_ACCOUNTING_PERIOD', 'ROLE_VIEW_ACCOUNTING_PERIOD']), 'sanctum');
        $period = $this->periodFor('2026-11-01');

        $response = $this->getJson("/e-pms/api/v1/accounting-periods/{$period->id}/checklist");
        $response->assertOk();
        $this->assertIsArray($response->json('stranded_drafts'));
        $this->assertArrayHasKey('suggested_forex_rate', $response->json());
    }

    public function test_close_requires_close_permission(): void
    {
        $this->actingAs($this->userWithRoles(['ROLE_VIEW_ACCOUNTING_PERIOD']), 'sanctum');
        $period = $this->periodFor('2026-10-01');

        $response = $this->postJson("/e-pms/api/v1/accounting-periods/{$period->id}/close", ['forex_rate' => 128]);
        $response->assertForbidden();
        $this->assertSame('open', $period->fresh()->status);
    }

    public function test_close_rejects_current_month(): void
    {
        $this->actingAs($this->userWithRoles(['ROLE_CLOSE_ACCOUNTING_PERIOD', 'ROLE_VIEW_ACCOUNTING_PERIOD']), 'sanctum');

        $now = Carbon::now();
        $period = $this->periodFor($now->format('Y-m-15'));

        $response = $this->postJson("/e-pms/api/v1/accounting-periods/{$period->id}/close", ['forex_rate' => 128]);
        $response->assertStatus(422);
        $this->assertSame('PeriodNotCloseable', $response->json('error'));
        $this->assertSame('open', $period->fresh()->status);
    }

    public function test_close_rejects_future_month(): void
    {
        $this->actingAs($this->userWithRoles(['ROLE_CLOSE_ACCOUNTING_PERIOD', 'ROLE_VIEW_ACCOUNTING_PERIOD']), 'sanctum');

        $now = Carbon::now();
        $future = $now->copy()->addMonth()->startOfMonth();
        $period = $this->periodFor($future->format('Y-m-15'));

        $response = $this->postJson("/e-pms/api/v1/accounting-periods/{$period->id}/close", ['forex_rate' => 128]);
        $response->assertStatus(422);
        $this->assertSame('open', $period->fresh()->status);
    }

    public function test_index_auto_creates_current_year_grid(): void
    {
        $this->actingAs($this->userWithRoles(['ROLE_VIEW_ACCOUNTING_PERIOD']), 'sanctum');

        // The test schema may hold only the single period created in setUp
        // helpers; the index endpoint for the current year must materialise
        // all 12 months.
        $response = $this->getJson('/e-pms/api/v1/accounting-periods?fiscal_year='.now()->year);
        $response->assertOk();
        $this->assertCount(12, $response->json('months'));

        // Future months are flaggable: the current month is never closable.
        $months = $response->json('months');
        $currentMonth = collect($months)->firstWhere('month', (int) now()->format('n'));
        $this->assertNotNull($currentMonth);
        $this->assertFalse($currentMonth['closable']);

        $pastMonth = collect($months)->firstWhere('month', 1);
        if ($pastMonth && (int) now()->format('n') > 1) {
            $this->assertTrue($pastMonth['closable']);
        }
    }

    public function test_close_creates_snapshot_and_logs(): void
    {
        $this->actingAs($this->userWithRoles(['ROLE_CLOSE_ACCOUNTING_PERIOD', 'ROLE_VIEW_ACCOUNTING_PERIOD']), 'sanctum');
        $period = $this->periodFor('2026-10-01');

        $response = $this->postJson("/e-pms/api/v1/accounting-periods/{$period->id}/close", ['forex_rate' => 128.45]);
        $response->assertOk();
        $this->assertSame('closed', $response->json('data.status'));

        $run = TrialBalanceRun::where('trigger', 'period_close')->first();
        $this->assertNotNull($run);
        $this->assertEquals('2026-10-31', $run->as_at_date->toDateString());
        // Layout rows are zero-filled for stable exports (15 named lines).
        $this->assertSame(15, $run->lines()->count());
        $this->assertSame('128.45', (string) $run->forex_rate);

        $log = AccountingPeriodLog::where('action', 'closed')->first();
        $this->assertNotNull($log);
        $this->assertSame($run->id, $log->snapshot_run_id);
    }

    public function test_close_validates_forex_rate(): void
    {
        $this->actingAs($this->userWithRoles(['ROLE_CLOSE_ACCOUNTING_PERIOD']), 'sanctum');
        $period = $this->periodFor('2026-10-01');

        $response = $this->postJson("/e-pms/api/v1/accounting-periods/{$period->id}/close", []);
        $response->assertStatus(422);

        $response = $this->postJson("/e-pms/api/v1/accounting-periods/{$period->id}/close", ['forex_rate' => 0]);
        $response->assertStatus(422);
    }

    public function test_reopen_permission_is_separate_from_close(): void
    {
        $this->actingAs($this->userWithRoles(['ROLE_CLOSE_ACCOUNTING_PERIOD', 'ROLE_VIEW_ACCOUNTING_PERIOD']), 'sanctum');
        $period = $this->periodFor('2026-10-01');
        $this->postJson("/e-pms/api/v1/accounting-periods/{$period->id}/close", ['forex_rate' => 128]);

        // Close permission alone cannot reopen.
        $response = $this->postJson("/e-pms/api/v1/accounting-periods/{$period->id}/reopen", ['reason' => 'Need fix']);
        $response->assertForbidden();
        $this->assertSame('closed', $period->fresh()->status);
    }

    public function test_reopen_with_admin_permission_and_reason(): void
    {
        $user = $this->userWithRoles([
            'ROLE_CLOSE_ACCOUNTING_PERIOD',
            'ROLE_VIEW_ACCOUNTING_PERIOD',
            'ROLE_REOPEN_ACCOUNTING_PERIOD',
        ]);
        $this->actingAs($user, 'sanctum');
        $period = $this->periodFor('2026-10-01');
        $this->postJson("/e-pms/api/v1/accounting-periods/{$period->id}/close", ['forex_rate' => 128]);

        $response = $this->postJson("/e-pms/api/v1/accounting-periods/{$period->id}/reopen", ['reason' => 'Correction: late invoice']);
        $response->assertOk();
        $this->assertSame('open', $response->json('data.status'));

        $log = AccountingPeriodLog::where('action', 'reopened')->first();
        $this->assertNotNull($log);
        $this->assertSame('Correction: late invoice', $log->reason);
    }

    public function test_reopen_requires_a_reason(): void
    {
        $this->actingAs($this->userWithRoles(['ROLE_REOPEN_ACCOUNTING_PERIOD']), 'sanctum');
        $period = $this->periodFor('2026-10-01');
        PeriodLock::withoutChecking(fn () => app(AccountingPeriodService::class)->closeMonth($period, 128, 1));

        $response = $this->postJson("/e-pms/api/v1/accounting-periods/{$period->id}/reopen", []);
        $response->assertStatus(422);
    }

    public function test_logs_return_full_history_with_snapshot_link(): void
    {
        $this->actingAs($this->userWithRoles(['ROLE_VIEW_ACCOUNTING_PERIOD']), 'sanctum');
        $period = $this->periodFor('2026-10-01');
        PeriodLock::withoutChecking(fn () => app(AccountingPeriodService::class)->closeMonth($period, 128, 1));

        $response = $this->getJson("/e-pms/api/v1/accounting-periods/{$period->id}/logs");
        $response->assertOk();
        $data = $response->json('data');
        $this->assertCount(1, $data);
        $this->assertSame('closed', $data[0]['action']);
        $this->assertNotNull($data[0]['snapshot_run_id']);
    }

    public function test_show_includes_snapshot_runs(): void
    {
        $this->actingAs($this->userWithRoles(['ROLE_VIEW_ACCOUNTING_PERIOD']), 'sanctum');
        $period = $this->periodFor('2026-10-01');
        PeriodLock::withoutChecking(fn () => app(AccountingPeriodService::class)->closeMonth($period, 128, 1));

        $response = $this->getJson("/e-pms/api/v1/accounting-periods/{$period->id}");
        $response->assertOk();
        $snapshots = $response->json('snapshots');
        $this->assertNotEmpty($snapshots);
        $this->assertSame('period_close', $snapshots[0]['trigger']);
    }
}
