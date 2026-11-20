<?php

namespace Tests\Feature;

use App\Models\AccountingPeriod;
use App\Models\CustInvoice;
use App\Models\CustInvoiceItem;
use App\Models\Order;
use App\Models\Project;
use App\Models\Quotation;
use App\Models\QuoteLineItem;
use App\Models\User;
use App\Services\AccountingPeriodService;
use App\Services\Concerns\PeriodLock;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * Enforcement matrix: observers must fire through the model layer for the
 * key financial entities, and item-level models must inherit their parent
 * document's period.
 */
class AccountingPeriodEnforcementTest extends TestCase
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
            'quote_line_items',
            'quotations',
            'cust_invoice_items',
            'cust_invoices',
            'order_items',
            'orders',
            'accounting_period_logs',
            'accounting_periods',
            'cust_payments',
            'trial_balance_run_lines',
            'trial_balance_runs',
            'accounts',
            'chart_of_accounts',
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
            $t->timestamp('deleted_at')->nullable();
            $t->unsignedBigInteger('deleted_by')->nullable();
        });
        \Schema::create('quote_line_items', function ($t) {
            $t->id();
            $t->unsignedBigInteger('quotation_id');
            $t->string('item_name')->nullable();
            $t->decimal('item_amount', 15, 2)->default(0);
            $t->decimal('total', 15, 2)->default(0);
            $t->decimal('quantity', 15, 2)->default(1);
            $t->timestamps();
            $t->unsignedBigInteger('created_by')->nullable();
            $t->unsignedBigInteger('updated_by')->nullable();
            $t->boolean('is_deleted')->default(false);
            $t->timestamp('deleted_at')->nullable();
            $t->unsignedBigInteger('deleted_by')->nullable();
        });
        \Schema::create('orders', function ($t) {
            $t->id();
            $t->unsignedBigInteger('quotation_id')->nullable();
            $t->string('order_number')->nullable();
            $t->string('status')->default('draft');
            $t->timestamps();
            $t->unsignedBigInteger('created_by')->nullable();
            $t->unsignedBigInteger('updated_by')->nullable();
            $t->boolean('is_deleted')->default(false);
            $t->timestamp('deleted_at')->nullable();
            $t->unsignedBigInteger('deleted_by')->nullable();
        });
        \Schema::create('order_items', function ($t) {
            $t->id();
            $t->unsignedBigInteger('order_id');
            $t->string('item_name')->nullable();
            $t->decimal('item_amount', 15, 2)->default(0);
            $t->timestamps();
            $t->unsignedBigInteger('created_by')->nullable();
            $t->unsignedBigInteger('updated_by')->nullable();
            $t->boolean('is_deleted')->default(false);
            $t->timestamp('deleted_at')->nullable();
            $t->unsignedBigInteger('deleted_by')->nullable();
        });
        \Schema::create('cust_invoices', function ($t) {
            $t->id();
            $t->unsignedBigInteger('order_id')->nullable();
            $t->string('invoice_number')->nullable();
            $t->string('status')->default('draft');
            $t->string('currency')->default('KES');
            $t->decimal('total_amount', 15, 2)->default(0);
            $t->decimal('tax_amount', 15, 2)->default(0);
            $t->timestamps();
            $t->unsignedBigInteger('created_by')->nullable();
            $t->unsignedBigInteger('updated_by')->nullable();
            $t->boolean('is_deleted')->default(false);
            $t->timestamp('deleted_at')->nullable();
            $t->unsignedBigInteger('deleted_by')->nullable();
        });
        \Schema::create('cust_invoice_items', function ($t) {
            $t->id();
            $t->unsignedBigInteger('invoice_id');
            $t->string('item_name')->nullable();
            $t->decimal('amount', 15, 2)->default(0);
            $t->timestamps();
            $t->unsignedBigInteger('created_by')->nullable();
            $t->unsignedBigInteger('updated_by')->nullable();
            $t->boolean('is_deleted')->default(false);
            $t->timestamp('deleted_at')->nullable();
            $t->unsignedBigInteger('deleted_by')->nullable();
        });
        \Schema::create('cust_payments', function ($t) {
            $t->id();
            $t->unsignedBigInteger('invoice_id')->nullable();
            $t->string('transaction_number')->nullable();
            $t->string('direction')->nullable();
            $t->string('transaction_type')->nullable();
            $t->decimal('amount_paid', 15, 2)->default(0);
            $t->decimal('tax_amount', 15, 2)->default(0);
            $t->decimal('net_amount', 15, 2)->default(0);
            $t->date('payment_date')->nullable();
            $t->string('payment_method')->nullable();
            $t->string('payment_status')->nullable();
            $t->string('currency')->default('KES');
            $t->boolean('reconciled')->default(false);
            $t->unsignedBigInteger('created_by')->nullable();
            $t->unsignedBigInteger('updated_by')->nullable();
            $t->timestamps();
            $t->boolean('is_deleted')->default(false);
            $t->timestamp('deleted_at')->nullable();
            $t->unsignedBigInteger('deleted_by')->nullable();
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

    private function closeMonth(string $date, int $userId = 1): AccountingPeriod
    {
        $period = app(AccountingPeriodService::class)->ensureForDate($date);

        return PeriodLock::withoutChecking(fn () => app(AccountingPeriodService::class)->closeMonth($period, 128, $userId));
    }

    private function createQuotation(string $createdAt, string $status = 'approved'): Quotation
    {
        return PeriodLock::withoutChecking(fn () => Quotation::create([
            'title' => 'Q',
            'status' => $status,
            'valid_until_date' => '2027-01-31',
            'currency' => 'KES',
            'created_at' => $createdAt,
        ]));
    }

    // ---------------------------------------------------------------

    public function test_cannot_create_quotation_line_under_closed_month_quotation(): void
    {
        $qt = $this->createQuotation('2026-10-15');
        $this->closeMonth('2026-10-15');

        $this->expectException(\App\Exceptions\PeriodLockedException::class);
        QuoteLineItem::create([
            'quotation_id' => $qt->id,
            'item_name' => 'Line',
            'item_amount' => 100,
        ]);
    }

    public function test_can_create_quotation_line_under_open_month_quotation(): void
    {
        $qt = $this->createQuotation('2026-11-15');
        $this->closeMonth('2026-10-15'); // close some other month

        $line = QuoteLineItem::create([
            'quotation_id' => $qt->id,
            'item_name' => 'Line',
            'item_amount' => 100,
        ]);

        $this->assertNotNull($line->id);
    }

    public function test_payment_into_open_month_against_closed_month_invoice_is_allowed(): void
    {
        $invoiceId = PeriodLock::withoutChecking(function () {
            // invoice dated October; October will be closed but November payment stays allowed
            \DB::table('cust_invoices')->insert([
                'order_id' => null,
                'invoice_number' => 'INV-1',
                'status' => 'sent',
                'currency' => 'KES',
                'created_at' => '2026-10-15 10:00:00',
                'updated_at' => now(),
                'is_deleted' => false,
            ]);

            return \DB::table('cust_invoices')->max('id');
        });
        $this->closeMonth('2026-10-15');

        // November payment: allowed (the payment is the November event).
        $payment = \App\Models\CustPayment::create([
            'invoice_id' => $invoiceId,
            'transaction_number' => 'P-1',
            'direction' => 'incoming',
            'transaction_type' => 'payment',
            'amount_paid' => 500,
            'payment_date' => '2026-11-20',
            'payment_method' => 'cash',
            'payment_status' => 'complete',
            'currency' => 'KES',
        ]);

        $this->assertNotNull($payment->id);
    }

    public function test_payment_into_closed_month_is_blocked(): void
    {
        $this->closeMonth('2026-10-15');

        $this->expectException(\App\Exceptions\PeriodLockedException::class);
        \App\Models\CustPayment::create([
            'transaction_number' => 'P-2',
            'direction' => 'incoming',
            'transaction_type' => 'payment',
            'amount_paid' => 500,
            'payment_date' => '2026-10-20',
            'payment_method' => 'cash',
            'payment_status' => 'complete',
            'currency' => 'KES',
        ]);
    }

    public function test_editing_closed_month_payment_is_blocked(): void
    {
        $paymentId = PeriodLock::withoutChecking(fn () => \App\Models\CustPayment::create([
            'transaction_number' => 'P-3',
            'direction' => 'incoming',
            'transaction_type' => 'payment',
            'amount_paid' => 500,
            'payment_date' => '2026-10-20',
            'payment_method' => 'cash',
            'payment_status' => 'complete',
            'currency' => 'KES',
        ])->id);
        $this->closeMonth('2026-10-15');

        $payment = \App\Models\CustPayment::find($paymentId);
        $this->expectException(\App\Exceptions\PeriodLockedException::class);
        $payment->update(['payment_status' => 'pending']);
    }

    public function test_order_item_inherits_closed_month_order_lock(): void
    {
        $orderId = PeriodLock::withoutChecking(function () {
            \DB::table('orders')->insert([
                'order_number' => 'ORD-1',
                'status' => 'approved',
                'created_at' => '2026-10-15 10:00:00',
                'updated_at' => now(),
                'is_deleted' => false,
            ]);

            return \DB::table('orders')->max('id');
        });
        $this->closeMonth('2026-10-15');

        $this->expectException(\App\Exceptions\PeriodLockedException::class);
        \App\Models\OrderItem::create([
            'order_id' => $orderId,
            'item_name' => 'Item',
            'item_amount' => 100,
        ]);
    }

    public function test_transaction_create_in_closed_month_is_blocked(): void
    {
        $this->closeMonth('2026-10-15');

        $this->expectException(\App\Exceptions\PeriodLockedException::class);
        \App\Models\Transaction::create([
            'transaction_type' => 'expense',
            'transaction_date' => '2026-10-10',
            'amount' => 1000,
            'transaction_currency' => 'KES',
        ]);
    }

    public function test_ledger_write_in_closed_month_is_blocked(): void
    {
        $this->closeMonth('2026-10-15');

        $this->expectException(\App\Exceptions\PeriodLockedException::class);
        \App\Models\CustomerTransactionsLedger::create([
            'transaction_type' => 'receipt',
            'transaction_date' => '2026-10-28',
            'amount' => 1000,
            'transaction_currency' => 'KES',
        ]);
    }
}
