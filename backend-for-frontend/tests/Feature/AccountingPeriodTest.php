<?php

namespace Tests\Feature;

use App\Models\AccountingPeriod;
use App\Models\AccountingPeriodLog;
use App\Models\Quotation;
use App\Models\User;
use App\Services\AccountingPeriodService;
use App\Services\Concerns\PeriodLock;
use Tests\TestCase;

class AccountingPeriodTest extends TestCase
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
            'accounting_period_logs',
            'accounting_periods',
            'trial_balance_run_lines',
            'trial_balance_runs',
            'quotations',
            'cust_invoices',
            'orders',
            'transactions',
            'cust_payments',
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
            $t->string('first_name')->nullable();
            $t->string('last_name')->nullable();
            $t->string('password')->nullable();
            $t->string('category')->default('internal');
            $t->boolean('is_active')->default(true);
            $t->unsignedBigInteger('company_id')->nullable();
            $t->unsignedBigInteger('customer_id')->nullable();
        });
        // Ledgers (read by TrialBalanceService; empty in these tests).
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
            $t->timestamps();
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

        // Minimal chart of accounts required by TrialBalanceService.
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

        // Accounting periods + audit trail (same shape as the production
        // migration) — inline so the test schema lives in one place.
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
            $t->timestamp('deleted_at')->nullable();
            $t->unsignedBigInteger('deleted_by')->nullable();
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

        // Trial balance tables (subset required by snapshot-on-close).
        \Schema::create('trial_balance_runs', function ($table) {
            $table->id();
            $table->string('run_number')->unique();
            $table->date('as_at_date');
            $table->decimal('forex_rate', 15, 6);
            $table->string('base_currency', 10)->default('KES');
            $table->string('trigger', 20)->default('manual');
            $table->unsignedBigInteger('accounting_period_id')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->index('as_at_date');
        });
        \Schema::create('trial_balance_run_lines', function ($table) {
            $table->id();
            $table->unsignedBigInteger('trial_balance_run_id');
            $table->unsignedBigInteger('chart_of_account');
            $table->string('category');
            $table->string('source_table');
            $table->string('source_type')->nullable();
            $table->unsignedBigInteger('source_id')->nullable();
            $table->unsignedBigInteger('account_id')->nullable();
            $table->decimal('debit_kes', 15, 2)->default(0);
            $table->decimal('credit_kes', 15, 2)->default(0);
            $table->decimal('debit_usd', 15, 2)->default(0);
            $table->decimal('credit_usd', 15, 2)->default(0);
            $table->text('description')->nullable();
            $table->timestamps();
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

    protected function service(): AccountingPeriodService
    {
        return app(AccountingPeriodService::class);
    }

    // ---------------------------------------------------------------
    // Period lifecycle
    // ---------------------------------------------------------------

    public function test_ensure_for_date_creates_year_quarter_month_hierarchy_open(): void
    {
        $period = $this->service()->ensureForDate('2026-11-15');

        $this->assertSame('month', $period->period_type);
        $this->assertSame('open', $period->status);
        $this->assertSame(11, $period->month);
        $this->assertSame(4, $period->quarter);
        $this->assertSame('2026-11-01', $period->start_date->toDateString());
        $this->assertSame('2026-11-30', $period->end_date->toDateString());
        $this->assertSame('Nov 2026', $period->name);

        $this->assertSame(3, AccountingPeriod::count()); // year + quarter + month
        $this->assertTrue(AccountingPeriod::where('period_type', 'year')->where('fiscal_year', 2026)->exists());
        $this->assertTrue(AccountingPeriod::where('period_type', 'quarter')->where('quarter', 4)->exists());
    }

    public function test_ensure_for_date_is_idempotent(): void
    {
        $this->service()->ensureForDate('2026-02-10');
        $this->service()->ensureForDate('2026-02-25');
        $this->assertSame(3, AccountingPeriod::count());
    }

    public function test_assert_open_returns_period_when_open(): void
    {
        $period = $this->service()->assertOpen('2026-06-05');
        $this->assertSame(6, $period->month);
    }

    public function test_assert_open_throws_when_month_closed(): void
    {
        $this->service()->ensureForDate('2026-03-01');
        AccountingPeriod::query()->months()->where('month', 3)->update(['status' => 'closed']);

        $this->expectException(\App\Exceptions\PeriodLockedException::class);
        $this->service()->assertOpen('2026-03-20');
    }

    public function test_missing_period_is_treated_as_open_by_is_date_closed(): void
    {
        $this->assertFalse($this->service()->isDateClosed('2099-01-01'));
    }

    // ---------------------------------------------------------------
    // Close / reopen
    // ---------------------------------------------------------------

    public function test_close_month_closes_and_creates_snapshot_and_log(): void
    {
        $user = User::create(['email' => 'a@b.c', 'category' => 'internal', 'is_active' => true]);
        $period = $this->service()->ensureForDate('2026-10-31');

        $closed = $this->service()->closeMonth($period, 128.45, $user->id);

        $this->assertSame('closed', $closed->status);
        $this->assertNotNull($closed->closed_at_snapshot);

        // snapshot exists, triggered by period close, linked to period
        $run = \App\Models\TrialBalanceRun::where('trigger', 'period_close')->first();
        $this->assertNotNull($run);
        $this->assertSame($closed->id, $run->accounting_period_id);
        $this->assertEquals('2026-10-31', $run->as_at_date->toDateString());

        // audit log written
        $log = AccountingPeriodLog::where('action', 'closed')->where('accounting_period_id', $closed->id)->first();
        $this->assertNotNull($log);
        $this->assertSame($run->id, $log->snapshot_run_id);
        $this->assertSame($user->id, (int) $log->performed_by);

        // log links back to snapshot
        $log->snapshot()->first();
        $this->assertNotNull($log->snapshot);
    }

    public function test_close_month_is_idempotent(): void
    {
        $user = User::create(['email' => 'a@b.c', 'category' => 'internal', 'is_active' => true]);
        $period = $this->service()->ensureForDate('2026-10-31');
        $this->service()->closeMonth($period, 128, $user->id);
        $this->service()->closeMonth($period, 128, $user->id);

        $this->assertSame(1, \App\Models\TrialBalanceRun::where('trigger', 'period_close')->count());
        $this->assertSame(1, AccountingPeriodLog::count());
    }

    public function test_reopen_requires_reason(): void
    {
        $user = User::create(['email' => 'a@b.c', 'category' => 'internal', 'is_active' => true]);
        $period = $this->service()->ensureForDate('2026-10-31');
        $this->service()->closeMonth($period, 128, $user->id);

        $this->expectException(\App\Exceptions\PeriodLockedException::class);
        $this->service()->reopen($period, '  ', $user->id);
    }

    public function test_reopen_writes_audit_and_restores_open(): void
    {
        $user = User::create(['email' => 'a@b.c', 'category' => 'internal', 'is_active' => true]);
        $period = $this->service()->ensureForDate('2026-10-31');
        $this->service()->closeMonth($period, 128, $user->id);

        $reopened = $this->service()->reopen($period, 'Correction to late invoice', $user->id);

        $this->assertSame('open', $reopened->status);
        $this->assertSame('Correction to late invoice', $reopened->last_reopen_reason);
        $this->assertNotNull($reopened->reopened_at);

        $log = AccountingPeriodLog::where('action', 'reopened')->first();
        $this->assertNotNull($log);
        $this->assertSame('Correction to late invoice', $log->reason);
        $this->assertSame($user->id, (int) $log->performed_by);

        // snapshot from the close is preserved (history untouched)
        $this->assertSame(1, \App\Models\TrialBalanceRun::where('trigger', 'period_close')->count());
    }

    public function test_reclose_after_reopen_creates_new_snapshot(): void
    {
        $user = User::create(['email' => 'a@b.c', 'category' => 'internal', 'is_active' => true]);
        $period = $this->service()->ensureForDate('2026-10-31');
        $this->service()->closeMonth($period, 128, $user->id);
        $this->service()->reopen($period, 'fix', $user->id);
        $this->service()->closeMonth($period, 130, $user->id);

        $this->assertSame(2, \App\Models\TrialBalanceRun::where('trigger', 'period_close')->count());
        // close + reopen + re-close = 3 audit entries
        $this->assertSame(3, AccountingPeriodLog::count());
        $this->assertSame(2, AccountingPeriodLog::where('action', 'closed')->count());
        $this->assertSame(1, AccountingPeriodLog::where('action', 'reopened')->count());
    }

    // ---------------------------------------------------------------
    // Observer enforcement (safety net)
    // ---------------------------------------------------------------

    private function createQuotationsTable(): void
    {
        \Schema::dropIfExists('quotations');
        \Schema::create('quotations', function ($t) {
            $t->id();
            $t->string('title')->nullable();
            $t->string('status')->default('draft');
            $t->date('valid_until_date')->nullable();
            $t->timestamps();
            $t->unsignedBigInteger('created_by')->nullable();
            $t->unsignedBigInteger('updated_by')->nullable();
            $t->boolean('is_deleted')->default(false);
            $t->timestamp('deleted_at')->nullable();
            $t->unsignedBigInteger('deleted_by')->nullable();
        });
    }

    public function test_observer_blocks_creating_document_in_closed_month(): void
    {
        $this->createQuotationsTable();
        $period = $this->service()->ensureForDate('2026-10-15');
        $this->service()->closeMonth($period, 128, 1);

        $this->expectException(\App\Exceptions\PeriodLockedException::class);
        Quotation::create([
            'title' => 'October quote',
            'valid_until_date' => '2026-10-25',
            'created_at' => '2026-10-15 10:00:00',
        ]);
    }

    public function test_observer_allows_creating_document_in_open_month(): void
    {
        $this->createQuotationsTable();
        $this->service()->ensureForDate('2026-11-15');
        $closedPeriod = $this->service()->ensureForDate('2026-10-15');
        $this->service()->closeMonth($closedPeriod, 128, 1);

        $q = Quotation::create([ // November: fine even though October is closed
            'title' => 'November quote',
            'valid_until_date' => '2026-11-25',
            'created_at' => '2026-11-15 10:00:00',
        ]);

        $this->assertNotNull($q->id);
    }

    public function test_observer_blocks_editing_document_dated_in_closed_month(): void
    {
        $this->createQuotationsTable();
        PeriodLock::withoutChecking(fn () => Quotation::create([
            'title' => 'October quote',
            'valid_until_date' => '2026-10-25',
            'created_at' => '2026-10-15 10:00:00',
        ]));
        $period = $this->service()->ensureForDate('2026-10-15');
        $this->service()->closeMonth($period, 128, 1);

        $quote = Quotation::first();
        $this->expectException(\App\Exceptions\PeriodLockedException::class);
        $quote->update(['title' => 'October quote (edited)']);
    }

    public function test_observer_blocks_moving_date_into_closed_month(): void
    {
        $this->createQuotationsTable();
        $this->service()->ensureForDate('2026-11-15');
        $october = $this->service()->ensureForDate('2026-10-15');
        $this->service()->closeMonth($october, 128, 1);

        $quote = Quotation::create([
            'title' => 'November quote',
            'valid_until_date' => '2026-11-25',
            'created_at' => '2026-11-15 10:00:00',
        ]);

        $this->expectException(\App\Exceptions\PeriodLockedException::class);
        $quote->update(['created_at' => '2026-10-20 10:00:00']); // pull into closed October
    }

    public function test_observer_blocks_deleting_document_dated_in_closed_month(): void
    {
        $this->createQuotationsTable();
        PeriodLock::withoutChecking(fn () => Quotation::create([
            'title' => 'October quote',
            'valid_until_date' => '2026-10-25',
            'created_at' => '2026-10-15 10:00:00',
        ]));
        $period = $this->service()->ensureForDate('2026-10-15');
        $this->service()->closeMonth($period, 128, 1);

        $quote = Quotation::first();
        $this->expectException(\App\Exceptions\PeriodLockedException::class);
        $quote->delete();
    }

    public function test_observer_blocks_soft_delete_flag_flip_in_closed_month(): void
    {
        $this->createQuotationsTable();
        PeriodLock::withoutChecking(fn () => Quotation::create([
            'title' => 'October quote',
            'valid_until_date' => '2026-10-25',
            'created_at' => '2026-10-15 10:00:00',
        ]));
        $period = $this->service()->ensureForDate('2026-10-15');
        $this->service()->closeMonth($period, 128, 1);

        $quote = Quotation::first();
        $this->expectException(\App\Exceptions\PeriodLockedException::class);
        $quote->softDelete();
    }

    public function test_editing_non_date_attribute_of_open_month_document_is_fine(): void
    {
        $this->createQuotationsTable();
        $this->service()->ensureForDate('2026-11-15');

        $quote = Quotation::create([
            'title' => 'November quote',
            'valid_until_date' => '2026-11-25',
            'created_at' => '2026-11-15 10:00:00',
        ]);
        $quote->update(['title' => 'November quote renamed']);

        $this->assertSame('November quote renamed', $quote->refresh()->title);
    }

    /**
     * A PAST month that has never been closed must keep accepting record
     * modifications: create, edit, date-move and logical delete. The lock
     * comes only from closing the month, not from the month being in the
     * past.
     */
    public function test_past_but_open_month_allows_all_record_modifications(): void
    {
        $this->createQuotationsTable();
        $service = $this->service();

        $past = \Illuminate\Support\Carbon::now()->subMonths(2);
        $this->assertSame('open', $service->ensureForDate($past->format('Y-m-15'))->status);

        // Create dated in the past-open month
        $quote = Quotation::create([
            'title' => 'Past open quote',
            'valid_until_date' => $past->format('Y-m-25'),
            'created_at' => $past->format('Y-m-10 10:00:00'),
        ]);
        $this->assertNotNull($quote->id);

        // Edit it
        $quote->update(['title' => 'Past open quote (edited)']);
        $this->assertSame('Past open quote (edited)', $quote->refresh()->title);

        // Move its date within the same past-open month
        $quote->update(['created_at' => $past->format('Y-m-20 10:00:00')]);
        $this->assertTrue($quote->refresh()->created_at->isSameMonth($past));

        // Logical delete
        $quote->softDelete();
        $this->assertTrue((bool) $quote->refresh()->is_deleted);
    }

    /**
     * The moment that past month is closed, the same edits must be blocked.
     */
    public function test_closing_the_past_month_locks_record_modifications(): void
    {
        $this->createQuotationsTable();
        $service = $this->service();

        $past = \Illuminate\Support\Carbon::now()->subMonths(2);
        \Illuminate\Support\Carbon::setTestNow($past->copy()->endOfMonth()->addDay());

        try {
            $period = $service->ensureForDate($past->format('Y-m-15'));
            $service->closeMonth($period, 128, 1);

            $quote = null;
            PeriodLock::withoutChecking(function () use (&$quote, $past) {
                $quote = Quotation::create([
                    'title' => 'Past closed quote',
                    'valid_until_date' => $past->format('Y-m-25'),
                    'created_at' => $past->format('Y-m-10 10:00:00'),
                ]);
            });

            $this->expectException(\App\Exceptions\PeriodLockedException::class);
            $quote->update(['title' => 'should fail']);
        } finally {
            \Illuminate\Support\Carbon::setTestNow();
        }
    }

    // ---------------------------------------------------------------
    // Ancestor sync
    // ---------------------------------------------------------------

    public function test_sync_ancestors_marks_quarter_and_year_closed_when_all_months_closed(): void
    {
        $user = 1;
        $service = $this->service();
        // Q1 months (Jan-Mar) are always in the past relative to "now" in
        // 2026; the close guard forbids current/future months only.
        collect([1, 2, 3])->each(function ($m) use ($service, $user) {
            $period = $service->ensureForDate("2026-{$m}-15");
            $service->closeMonth($period, 128, $user);
        });

        $q1 = AccountingPeriod::where('period_type', 'quarter')->where('fiscal_year', 2026)->where('quarter', 1)->first();
        $fy = AccountingPeriod::where('period_type', 'year')->where('fiscal_year', 2026)->first();
        $this->assertSame('closed', $q1->status);
        $this->assertSame('open', $fy->status); // only Q1 closed of 4 quarters
    }

    public function test_sync_ancestors_reopens_quarter_and_year_when_month_reopened(): void
    {
        $user = 1;
        $service = $this->service();
        // Use Q1 months (always past relative to a 2026 test clock).
        collect([1, 2, 3])->each(function ($m) use ($service, $user) {
            $period = $service->ensureForDate("2026-{$m}-15");
            $service->closeMonth($period, 128, $user);
        });

        $feb = AccountingPeriod::where('period_type', 'month')->where('month', 2)->first();
        $service->reopen($feb, 'need fix', $user);

        // February is reopened: Q1 / FY rollups must flip back to open.
        $this->assertSame('open', $feb->status);

        $q1 = AccountingPeriod::where('period_type', 'quarter')->where('fiscal_year', 2026)->where('quarter', 1)->first();
        $fy = AccountingPeriod::where('period_type', 'year')->where('fiscal_year', 2026)->first();
        $this->assertSame('open', $q1->status);
        $this->assertSame('open', $fy->status);
    }

    // ---------------------------------------------------------------
    // Close-time guarding: current and future months cannot be closed
    // ---------------------------------------------------------------

    public function test_current_month_cannot_be_closed(): void
    {
        $user = 1;
        $service = $this->service();
        $now = \Illuminate\Support\Carbon::now();
        $period = $service->ensureForDate($now->format('Y-m-15'));

        $this->expectException(\App\Exceptions\PeriodCloseNotAllowedException::class);
        $service->closeMonth($period, 128, $user);
    }

    public function test_future_month_of_current_year_cannot_be_closed(): void
    {
        $user = 1;
        $service = $this->service();
        $now = \Illuminate\Support\Carbon::now();
        $futureMonth = $now->month >= 12 ? null : $now->month + 1;

        if ($futureMonth === null) {
            $this->markTestSkipped('Current month is December; the year-rollover test covers this case.');
        }

        $period = $service->ensureForDate($now->format('Y').'-'.$futureMonth.'-15');

        $this->expectException(\App\Exceptions\PeriodCloseNotAllowedException::class);
        $service->closeMonth($period, 128, $user);
    }

    public function test_future_year_months_cannot_be_closed(): void
    {
        $user = 1;
        $service = $this->service();
        $period = $service->ensureForDate(($this->futureYear()).'-03-15');

        $this->assertTrue($service->isCurrentOrFutureMonth($period));
        $this->expectException(\App\Exceptions\PeriodCloseNotAllowedException::class);
        $service->closeMonth($period, 128, $user);
    }

    public function test_past_month_can_still_be_closed(): void
    {
        $user = 1;
        $service = $this->service();
        $past = \Illuminate\Support\Carbon::now()->subMonths(2)->startOfMonth();
        $period = $service->ensureForDate($past->format('Y-m-15'));

        $closed = $service->closeMonth($period, 128, $user);
        $this->assertSame('closed', $closed->status);
    }

    // ---------------------------------------------------------------
    // Auto-creation of periods for future years (no cron)
    // ---------------------------------------------------------------

    public function test_fetching_current_year_periods_creates_missing_months(): void
    {
        $service = $this->service();

        // Wipe periods entirely, then fetch via monthStatuses (the index path).
        AccountingPeriod::query()->delete();
        $this->assertSame(0, AccountingPeriod::count());

        $months = $service->monthStatuses((int) now()->year);

        $this->assertCount(12, $months);
        $this->assertSame(12 + 4 + 1, AccountingPeriod::count()); // months + quarters + year
    }

    public function test_fetching_current_year_in_december_prepares_next_year_on_first_use(): void
    {
        $service = $this->service();

        // Simulate posting into January of next year: ensureForDate must
        // create the next year's hierarchy even if ensureCurrentYear only
        // built the current year.
        $janNext = $service->ensureForDate($this->futureYear().'-01-15');

        $this->assertSame(1, $janNext->month);
        $this->assertSame($this->futureYear(), $janNext->fiscal_year);
        $this->assertNotNull(
            AccountingPeriod::where('period_type', 'year')->where('fiscal_year', $this->futureYear())->first()
        );
    }

    public function test_ensure_year_is_idempotent_and_backfills_partial_years(): void
    {
        $service = $this->service();
        $year = (int) now()->year;

        // Drop everything and create only March
        AccountingPeriod::query()->delete();
        $service->ensureForDate("$year-03-15");
        $this->assertSame(3, AccountingPeriod::count()); // year + Q1 + March

        $months = $service->monthStatuses($year);

        $this->assertCount(12, $months);
        $this->assertSame(17, AccountingPeriod::count()); // full grid
    }

    public function test_next_year_grid_bootstraps_when_fetching_during_december(): void
    {
        $service = $this->service();
        $year = (int) now()->year;

        AccountingPeriod::query()->delete();

        // Travel to Dec 15 of the current year: fetching periods must
        // materialise both the current and the NEXT year's 12 months.
        \Carbon\Carbon::setTestNow(\Carbon\Carbon::create($year, 12, 15, 12, 0, 0));
        try {
            $service->monthStatuses($year);

            $this->assertSame(17, AccountingPeriod::where('fiscal_year', $year)->count());
            $this->assertSame(17, AccountingPeriod::where('fiscal_year', $year + 1)->count());
            $this->assertTrue(
                AccountingPeriod::where('period_type', 'month')
                    ->where('fiscal_year', $year + 1)
                    ->where('month', 1)
                    ->exists()
            );
        } finally {
            \Carbon\Carbon::setTestNow();
        }
    }

    public function test_closing_next_year_january_still_blocked_in_december(): void
    {
        $service = $this->service();
        $year = (int) now()->year;

        \Carbon\Carbon::setTestNow(\Carbon\Carbon::create($year, 12, 15, 12, 0, 0));
        try {
            $period = $service->ensureForDate(($year + 1).'-01-15');

            $this->expectException(\App\Exceptions\PeriodCloseNotAllowedException::class);
            $service->closeMonth($period, 128, 1);
        } finally {
            \Carbon\Carbon::setTestNow();
        }
    }

    private function futureYear(): int
    {
        $now = \Illuminate\Support\Carbon::now();

        return $now->month === 12 ? $now->year + 1 : $now->year + 1;
    }
}
