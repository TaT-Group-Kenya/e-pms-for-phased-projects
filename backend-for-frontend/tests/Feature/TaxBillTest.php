<?php

namespace Tests\Feature;

use App\Models\Account;
use App\Models\Download;
use App\Models\TaxBill;
use App\Models\TaxTransaction;
use App\Models\User;
use App\Services\TaxBillService;
use App\Services\TaxTransactionService;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class TaxBillTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Schema::dropIfExists('tax_bills');
        Schema::dropIfExists('tax_transactions');
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('chart_of_accounts');
        Schema::dropIfExists('accounts');
        Schema::dropIfExists('users');

        Schema::create('sys_configs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('value')->nullable();
            $table->boolean('readonly')->default(false);
            $table->boolean('is_file')->default(false);
        });
        Schema::create('downloads', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('path')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
        });
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
        });
        Schema::create('chart_of_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->boolean('is_bank_account_grp')->default(false);
            $table->boolean('is_deleted')->default(false);
        });
        \DB::table('chart_of_accounts')->insert(['code' => '2000', 'name' => 'Liabilities']);
        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->nullable();
            $table->string('currency')->default('KES');
            $table->decimal('balance', 15, 2)->default(0);
            $table->boolean('overdraft_allowed')->default(false);
            $table->unsignedBigInteger('chart_of_account_id')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
        });
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_number');
            $table->string('transaction_type');
            $table->date('transaction_date');
            $table->date('posted_date')->nullable();
            $table->decimal('amount', 15, 2);
            $table->string('transaction_currency', 10)->nullable();
            $table->string('base_currency', 10)->nullable();
            $table->decimal('exchange_rate', 15, 6)->default(1);
            $table->decimal('converted_amount', 15, 2)->nullable();
            $table->decimal('converted_tax_amount', 15, 2)->nullable();
            $table->decimal('converted_net_amount', 15, 2)->nullable();
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('net_amount', 15, 2)->default(0);
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->unsignedBigInteger('company_id')->nullable();
            $table->string('source_type')->nullable();
            $table->unsignedBigInteger('source_id')->nullable();
            $table->unsignedBigInteger('account_debit')->nullable();
            $table->unsignedBigInteger('account_credit')->nullable();
            $table->unsignedBigInteger('chart_of_account')->nullable();
            $table->string('category')->nullable();
            $table->string('payment_method')->nullable();
            $table->string('bank_account')->nullable();
            $table->string('check_number')->nullable();
            $table->string('transaction_status')->default('cleared');
            $table->unsignedBigInteger('related_transaction_id')->nullable();
            $table->text('narration')->nullable();
            $table->boolean('is_recurring')->default(false);
            $table->string('fiscal_year')->nullable();
            $table->string('accounting_period')->nullable();
            $table->boolean('is_adjusting_entry')->default(false);
            $table->unsignedBigInteger('cost_center_id')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });
        Schema::create('tax_bills', function (Blueprint $table) {
            $table->id();
            $table->string('bill_number')->unique();
            $table->unsignedTinyInteger('period_month');
            $table->unsignedSmallInteger('period_year');
            $table->decimal('vat_out', 15, 2)->default(0);
            $table->decimal('vat_in', 15, 2)->default(0);
            $table->decimal('vat_liability', 15, 2)->default(0);
            $table->decimal('amount', 15, 2)->default(0);
            $table->decimal('paid_amount', 15, 2)->default(0);
            $table->decimal('settled_for_period', 15, 2)->default(0);
            $table->decimal('carried_forward', 15, 2)->default(0);
            $table->decimal('balance', 15, 2)->default(0);
            $table->string('status')->default('pending_payment');
            $table->date('run_date')->nullable();
            $table->date('paid_date')->nullable();
            $table->unsignedBigInteger('payment_id')->nullable();
            $table->unsignedBigInteger('transaction_id')->nullable();
            $table->unsignedBigInteger('tax_ledger_entry_id')->nullable();
            $table->string('paid_from_account')->nullable();
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });
        Schema::create('tax_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_number')->unique();
            $table->unsignedBigInteger('tax_id')->nullable();
            $table->string('side')->default('cr');
            $table->string('direction')->default('collected');
            $table->string('entry_type')->nullable();
            $table->unsignedBigInteger('chart_of_account')->nullable();
            $table->decimal('amount', 15, 2);
            $table->string('transaction_currency', 10)->nullable();
            $table->decimal('exchange_rate', 15, 6)->default(1);
            $table->decimal('converted_amount', 15, 2)->default(0);
            $table->decimal('running_balance', 15, 2)->nullable();
            $table->date('transaction_date');
            $table->date('posted_date')->nullable();
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->unsignedBigInteger('company_id')->nullable();
            $table->unsignedBigInteger('supplier_or_customer')->nullable();
            $table->string('kra_pin', 64)->nullable();
            $table->string('source_type');
            $table->unsignedBigInteger('source_id')->nullable();
            $table->unsignedBigInteger('payment_id')->nullable();
            $table->text('narration')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });

        TaxTransactionService::recalculateRunningBalances();
    }

    protected function tearDown(): void
    {
        Schema::disableForeignKeyConstraints();
        parent::tearDown();
    }

    /** Post a VAT_OUT credit into the ledger on the given date. */
    protected function postVatOut(string $date, float $amount, string $sourceType = 'cust_invoice', int $sourceId = 1): TaxTransaction
    {
        $entry = TaxTransactionService::record([
            'side' => TaxTransactionService::SIDE_CR,
            'entry_type' => TaxTransactionService::ENTRY_VAT_OUT,
            'source_type' => $sourceType,
            'source_id' => $sourceId,
            'amount' => $amount,
            'transaction_currency' => 'KES',
            'exchange_rate' => 1,
            'transaction_date' => $date,
        ]);
        TaxTransactionService::recalculateRunningBalances();

        return $entry;
    }

    /** Post a VAT_IN debit into the ledger on the given date. */
    protected function postVatIn(string $date, float $amount, string $sourceType = 'company_invoice', int $sourceId = 1): TaxTransaction
    {
        $entry = TaxTransactionService::record([
            'side' => TaxTransactionService::SIDE_DR,
            'entry_type' => TaxTransactionService::ENTRY_VAT_IN,
            'source_type' => $sourceType,
            'source_id' => $sourceId,
            'amount' => $amount,
            'transaction_currency' => 'KES',
            'exchange_rate' => 1,
            'transaction_date' => $date,
        ]);
        TaxTransactionService::recalculateRunningBalances();

        return $entry;
    }

    protected function account(float $balance = 1000000): Account
    {
        return Account::create([
            'name' => 'KES Bank Account',
            'code' => 'INT-ACC-KES',
            'currency' => 'KES',
            'balance' => $balance,
        ]);
    }

    public function test_run_month_snapshots_ledger_positions_into_a_bill(): void
    {
        $this->postVatOut('2026-10-05', 13568);
        $this->postVatOut('2026-10-09', 576);
        $this->postVatIn('2026-10-12', 9600);

        $bill = (new TaxBillService)->runMonth(2026, 10, 1);

        $this->assertSame('TAXBILL-000001', $bill->bill_number);
        $this->assertEquals(14144.00, (float) $bill->vat_out);
        $this->assertEquals(9600.00, (float) $bill->vat_in);
        $this->assertEquals(4544.00, (float) $bill->vat_liability);
        $this->assertEquals(4544.00, (float) $bill->amount);
        $this->assertEquals(0.00, (float) $bill->paid_amount);
        $this->assertEquals(4544.00, (float) $bill->balance);
        $this->assertSame(TaxBill::STATUS_PENDING_PAYMENT, $bill->status);
        $this->assertSame('VAT Bill October 2026', $bill->label());
    }

    public function test_a_month_cannot_be_run_twice(): void
    {
        $this->postVatOut('2026-10-05', 1000);

        $service = new TaxBillService;
        $service->runMonth(2026, 10, 1);

        $this->expectException(ValidationException::class);
        $service->runMonth(2026, 10, 1);
    }

    public function test_months_with_no_liability_cannot_be_billed(): void
    {
        $this->expectException(ValidationException::class);

        (new TaxBillService)->runMonth(2026, 9, 1);
    }

    public function test_paying_a_bill_posts_transaction_tax_ledger_entry_and_updates_account(): void
    {
        $this->postVatOut('2026-10-05', 1600);

        $bill = (new TaxBillService)->runMonth(2026, 10, 1);
        $account = $this->account(100000);

        $paid = (new TaxBillService)->payFromAccount($bill, [
            'account_id' => $account->id,
            'payment_date' => '2026-11-05',
        ], 1);

        // Bill settles to paid with no balance left.
        $this->assertSame(TaxBill::STATUS_PAID, $paid->status);
        $this->assertEquals(1600.00, (float) $paid->paid_amount);
        $this->assertEquals(0.00, (float) $paid->balance);
        $this->assertSame('2026-11-05', $paid->paid_date->toDateString());

        // transactions ledger: expense out of the funding account.
        $this->assertNotNull($paid->transaction_id);
        $transaction = $paid->transaction;
        $this->assertSame('expense', $transaction->transaction_type);
        $this->assertEquals(1600.00, (float) $transaction->amount);
        $this->assertSame('tax_bill', $transaction->source_type);

        // Tax ledger: a VAT_IN entry sourced on the bill that reduces the liability.
        $this->assertNotNull($paid->tax_ledger_entry_id);
        $entry = $paid->taxLedgerEntry;
        $this->assertSame(TaxTransactionService::ENTRY_VAT_IN, $entry->entry_type);
        $this->assertSame(TaxTransactionService::SIDE_DR, $entry->side);
        $this->assertEquals(-1600.00, (float) $entry->converted_amount);
        $this->assertSame('tax_bill', $entry->source_type);

        // The running ledger liability reflects the remittance.
        $this->assertEquals(0.00, (float) $entry->running_balance);

        // Funding account balance was reduced.
        $this->assertEquals(98400.00, (float) $account->fresh()->balance);
    }

    public function test_paid_bills_reject_further_payments(): void
    {
        $this->postVatOut('2026-10-05', 1600);

        $service = new TaxBillService;
        $bill = $service->runMonth(2026, 10, 1);
        $account = $this->account(100000);

        $service->payFromAccount($bill, [
            'account_id' => $account->id,
            'payment_date' => '2026-11-05',
        ], 1);

        $this->expectException(ValidationException::class);
        $service->payFromAccount($bill, [
            'account_id' => $account->id,
            'payment_date' => '2026-11-06',
        ], 1);
    }

    public function test_payment_fails_on_insufficient_balance(): void
    {
        $this->postVatOut('2026-10-05', 1600);

        $service = new TaxBillService;
        $bill = $service->runMonth(2026, 10, 1);
        $account = $this->account(100);

        $this->expectException(ValidationException::class);
        $service->payFromAccount($bill, [
            'account_id' => $account->id,
            'payment_date' => '2026-11-05',
        ], 1);
    }

    public function test_index_endpoint_reports_bills_in_report_shape(): void
    {
        \DB::table('users')->insert(['id' => 1, 'name' => 'Tester']);
        $user = User::query()->findOrFail(1);

        $this->postVatOut('2026-10-05', 1600);

        $bill = (new TaxBillService)->runMonth(2026, 10, 1);

        Gate::before(fn () => true);

        $this->actingAs($user, 'sanctum')
            ->getJson('/e-pms/api/v1/tax-bills')
            ->assertOk()
            ->assertJsonPath('data.0.bill_number', $bill->bill_number)
            ->assertJsonPath('data.0.particulars', 'VAT Bill October 2026')
            ->assertJsonPath('data.0.name', 'Tax Agency (Sales Tax)')
            ->assertJsonPath('data.0.amount', 1600)
            ->assertJsonPath('data.0.paid', 0)
            ->assertJsonPath('data.0.balance', 1600)
            ->assertJsonPath('data.0.status', 'pending_payment');
    }

    public function test_run_endpoint_rejects_duplicates_and_pay_endpoint_settles(): void
    {
        \DB::table('users')->insert(['id' => 1, 'name' => 'Tester']);
        $user = User::query()->findOrFail(1);

        $this->postVatOut('2026-10-05', 1600);
        $account = $this->account(100000);

        Gate::before(fn () => true);

        $billId = $this->actingAs($user, 'sanctum')
            ->postJson('/e-pms/api/v1/tax-bills/run', ['period_year' => 2026, 'period_month' => 10])
            ->assertStatus(201)
            ->json('data.id');

        // Second run for the same month must fail validation.
        $this->actingAs($user, 'sanctum')
            ->postJson('/e-pms/api/v1/tax-bills/run', ['period_year' => 2026, 'period_month' => 10])
            ->assertStatus(422);

        // Pay through the endpoint.
        $this->actingAs($user, 'sanctum')
            ->postJson("/e-pms/api/v1/tax-bills/{$billId}/pay", [
                'account_id' => $account->id,
                'payment_date' => '2026-11-05',
            ])
            ->assertOk()
            ->assertJsonPath('data.status', 'paid')
            ->assertJsonPath('data.balance', 0);

        // Further payments are rejected.
        $this->actingAs($user, 'sanctum')
            ->postJson("/e-pms/api/v1/tax-bills/{$billId}/pay", [
                'account_id' => $account->id,
                'payment_date' => '2026-11-06',
            ])
            ->assertStatus(422);
    }

    public function test_pdf_export_streams_a_document(): void
    {
        \DB::table('users')->insert(['id' => 1, 'name' => 'Tester']);
        $user = User::query()->findOrFail(1);

        $this->postVatOut('2026-10-05', 1600);
        $bill = (new TaxBillService)->runMonth(2026, 10, 1);

        Gate::before(fn () => true);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson("/e-pms/api/v1/tax-bills/{$bill->id}/export-pdf");

        $response->assertOk();
        $this->assertSame('application/pdf', $response->headers->get('Content-Type'));
        $this->assertStringContainsString('PDF', substr($response->getContent(), 0, 8));
        $this->assertNotNull(Download::where('name', $bill->bill_number)->first());
    }

    public function test_current_month_cannot_be_run(): void
    {
        // Post VAT into the current month so the run is not blocked by the
        // "no liability" rule — only by the completed-month rule.
        $this->postVatOut(now()->toDateString(), 1600);

        try {
            (new TaxBillService)->runMonth((int) now()->year, (int) now()->month, 1);
            $this->fail('Current month run should have been rejected.');
        } catch (ValidationException $e) {
            $this->assertStringContainsString('has not been completed yet', collect($e->errors())->flatten()->first());
        }

        // A completed month (last month) is allowed.
        $previous = now()->startOfMonth()->subDay();
        $this->postVatOut($previous->endOfMonth()->toDateString(), 1600);

        $bill = (new TaxBillService)->runMonth((int) $previous->year, (int) $previous->month, 1);
        $this->assertSame(1600.00, (float) $bill->vat_liability);
    }

    public function test_payment_in_a_later_month_still_settles_its_own_period(): void
    {
        // Month 1 declares a liability; month 2 adds more liability; the
        // month-1 bill is only paid during month 2.
        $previousPrevious = now()->startOfMonth()->subMonths(2);
        $previous = now()->startOfMonth()->subMonth();

        $this->postVatOut($previousPrevious->copy()->endOfMonth()->toDateString(), 3000);
        $bill = (new TaxBillService)->runMonth((int) $previousPrevious->year, (int) $previousPrevious->month, 1);

        $this->postVatOut($previous->copy()->endOfMonth()->toDateString(), 2000);

        // The payment posts inside the *previous* month, after month 2
        // entries exist in the ledger.
        $account = $this->account(100000);
        $paid = (new TaxBillService)->payFromAccount($bill, [
            'account_id' => $account->id,
            'payment_date' => $previous->endOfMonth()->toDateString(),
        ], 1);

        // The bill's own period is settled exactly by its payment.
        $this->assertSame(TaxBill::STATUS_PAID, $paid->status);
        $this->assertEquals(3000.00, (float) $paid->settled_for_period);
        $this->assertEquals(3000.00, (float) $paid->paid_amount);
        $this->assertEquals(0.00, (float) $paid->carried_forward);
        $this->assertEquals(0.00, (float) $paid->balance);

        // Chronological ledger liability after the settlement: 3000 + 2000 - 3000.
        $this->assertEquals(2000.00, TaxTransactionService::vatPositions()['net']);

        // Per-period reconciliation holds: month 1 declared 3000 and settled
        // 3000 (outstanding 0) even though the payment happened later.
        $reconciliation = TaxBillService::periodReconciliation();
        $row = collect($reconciliation)->firstWhere('period', sprintf('%04d-%02d', $previousPrevious->year, $previousPrevious->month));
        $this->assertNotNull($row);
        $this->assertEquals(3000.00, $row['declared']);
        $this->assertEquals(3000.00, $row['settled_for_period']);
        $this->assertEquals(0.00, $row['outstanding']);
        $this->assertSame($previous->endOfMonth()->toDateString(), $row['payment_date']);

        // Chronological net reconciles with per-period state:
        // net liability == declared-unbilled + outstanding-billed.
        $outstanding = array_sum(array_column($reconciliation, 'outstanding'));
        $declared = array_sum(array_column($reconciliation, 'declared'));
        $settled = array_sum(array_column($reconciliation, 'settled_for_period'));
        $currentNet = TaxTransactionService::vatPositions()['net'];

        // billed-declared - billed-settled = outstanding; unbilled declared
        // (month 2's 2000) is on top of that.
        $this->assertEquals(
            round($declared - $settled, 2) + 2000.00,
            round($currentNet, 2),
            'Per-period reconciliation must agree with the chronological ledger net.'
        );
        $this->assertEquals(round($outstanding, 2), 0.0);
    }

    public function test_reconciliation_endpoint_reports_periods(): void
    {
        \DB::table('users')->insert(['id' => 1, 'name' => 'Tester']);
        $user = User::query()->findOrFail(1);

        $previous = now()->startOfMonth()->subDay();
        $this->postVatOut($previous->copy()->endOfMonth()->toDateString(), 1600);
        $bill = (new TaxBillService)->runMonth((int) $previous->year, (int) $previous->month, 1);

        Gate::before(fn () => true);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/e-pms/api/v1/tax-bills/reconciliation')
            ->assertOk();

        $row = collect($response->json('data'))->firstWhere('period', sprintf('%04d-%02d', $previous->year, $previous->month));
        $this->assertNotNull($row);
        $this->assertEquals($bill->bill_number, $row['bill_number']);
        $this->assertEquals(1600.00, $row['declared']);
        $this->assertEquals(1600.00, $row['outstanding']);

        $this->assertEquals(1600.00, $response->json('totals.declared'));
        $this->assertEquals(1600.00, $response->json('totals.outstanding'));
    }

    public function test_payment_ledger_entry_particulars_name_the_funding_account(): void
    {
        $this->postVatOut(now()->startOfMonth()->subDay()->endOfMonth()->toDateString(), 1600);

        $service = new TaxBillService;
        $bill = $service->runMonth((int) now()->startOfMonth()->subDay()->year, (int) now()->startOfMonth()->subDay()->month, 1);
        $account = $this->account(1000000);

        $paid = $service->payFromAccount($bill, [
            'account_id' => $account->id,
            'payment_date' => now()->toDateString(),
        ], 1);

        $entry = $paid->taxLedgerEntry;
        $document = $entry->sourceDocument();

        $this->assertSame(
            'Tax bill settlement from account '.($account->code ?? ('#'.$account->id)),
            $document['particulars'],
            'The ledger particulars must name the funding account.'
        );
        $this->assertSame($bill->bill_number, $document['number']);
        $this->assertSame('Kenya Revenue Authority', $document['party_name']);
    }
}
