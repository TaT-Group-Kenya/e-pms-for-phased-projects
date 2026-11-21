<?php

namespace Tests\Feature;

use App\Models\ChartOfAccount;
use App\Models\CompanyInvoice;
use App\Models\CustCreditNote;
use App\Models\CustInvoice;
use App\Models\TaxTransaction;
use App\Models\User;
use App\Services\TaxTransactionService;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class TaxLedgerTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Schema::dropIfExists('tax_transactions');
        Schema::dropIfExists('chart_of_accounts');
        Schema::dropIfExists('customers');
        Schema::dropIfExists('companies');
        Schema::dropIfExists('cust_invoices');
        Schema::dropIfExists('cust_debit_notes');
        Schema::dropIfExists('cust_credit_notes');
        Schema::dropIfExists('company_invoices');
        Schema::dropIfExists('company_credit_notes');
        Schema::dropIfExists('users');

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->boolean('is_deleted')->default(false);
        });
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('kra_pin')->nullable();
            $table->boolean('is_deleted')->default(false);
        });
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('kra_pin')->nullable();
            $table->boolean('is_deleted')->default(false);
        });
        Schema::create('chart_of_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->boolean('is_bank_account_grp')->default(false);
        });
        ChartOfAccount::create(['code' => '2000', 'name' => 'Liabilities']);

        Schema::create('cust_invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number');
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->string('currency')->default('KES');
            $table->decimal('forex_rate', 15, 6)->default(1);
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->string('status')->default('draft');
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('created_at')->nullable();
        });
        Schema::create('cust_debit_notes', function (Blueprint $table) {
            $table->id();
            $table->string('debit_note_number');
            $table->unsignedBigInteger('invoice_id')->nullable();
            $table->string('currency')->default('KES');
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->string('status')->default('draft');
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('created_at')->nullable();
        });
        Schema::create('cust_credit_notes', function (Blueprint $table) {
            $table->id();
            $table->string('credit_note_number');
            $table->unsignedBigInteger('invoice_id')->nullable();
            $table->string('currency')->default('KES');
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->string('status')->default('draft');
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('created_at')->nullable();
        });
        Schema::create('company_invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number');
            $table->unsignedBigInteger('company_id')->nullable();
            $table->string('currency')->default('KES');
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->string('status')->default('draft');
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('created_at')->nullable();
        });
        Schema::create('company_credit_notes', function (Blueprint $table) {
            $table->id();
            $table->string('credit_note_number');
            $table->unsignedBigInteger('company_id')->nullable();
            $table->string('currency')->default('KES');
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->string('status')->default('draft');
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('tax_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_number')->unique();
            $table->unsignedBigInteger('tax_id')->nullable();
            $table->enum('side', ['dr', 'cr'])->default('cr');
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

        Schema::enableForeignKeyConstraints();
    }

    protected function tearDown(): void
    {
        Schema::disableForeignKeyConstraints();
        parent::tearDown();
    }

    protected function invoice(array $overrides = []): array
    {
        $customer = \DB::table('customers')->insertGetId([
            'name' => 'Acme Ltd', 'kra_pin' => 'P051000000A',
        ]);
        $invoiceId = \DB::table('cust_invoices')->insertGetId(array_merge([
            'invoice_number' => 'INV-1',
            'customer_id' => $customer,
            'currency' => 'KES',
            'forex_rate' => 1,
            'tax_amount' => 160,
            'status' => 'sent',
            'created_at' => '2026-01-10 09:00:00',
        ], $overrides));

        return ['invoice' => CustInvoice::query()->findOrFail($invoiceId), 'customer_id' => $customer];
    }

    public function test_sent_invoice_posts_vat_out_credit_with_running_balance(): void
    {
        ['invoice' => $invoice] = $this->invoice();

        TaxTransactionService::syncInvoicePosition($invoice);

        $entry = TaxTransaction::query()->sole();

        $this->assertSame(TaxTransactionService::ENTRY_VAT_OUT, $entry->entry_type);
        $this->assertSame(TaxTransactionService::SIDE_CR, $entry->side);
        $this->assertEquals(160.00, (float) $entry->converted_amount);
        $this->assertEquals(160.00, (float) $entry->running_balance);
        $this->assertSame('P051000000A', $entry->kra_pin);
        $this->assertEquals($invoice->customer_id, (int) $entry->supplier_or_customer);
        $this->assertSame('cust_invoice', $entry->source_type);
        $this->assertSame('2026-01-10', $entry->transaction_date->toDateString());
    }

    public function test_usd_invoice_converts_to_kes_at_invoice_rate(): void
    {
        ['invoice' => $invoice] = $this->invoice(['currency' => 'USD', 'forex_rate' => 129.5, 'tax_amount' => 100]);

        TaxTransactionService::syncInvoicePosition($invoice);

        $entry = TaxTransaction::query()->sole();

        $this->assertEquals(12950.00, (float) $entry->converted_amount);
        $this->assertEquals(12950.00, (float) $entry->running_balance);
    }

    public function test_tax_increase_restates_through_balancing_correction(): void
    {
        ['invoice' => $invoice] = $this->invoice();

        TaxTransactionService::syncInvoicePosition($invoice);

        // The invoice is edited: tax rises from 160 to 300.
        $invoice->tax_amount = 300;
        \DB::table('cust_invoices')->where('id', $invoice->id)->update(['tax_amount' => 300]);

        TaxTransactionService::syncInvoicePosition($invoice);

        $entries = TaxTransaction::query()->orderBy('id')->get();
        $this->assertCount(2, $entries);

        // The original VAT_OUT entry is untouched (kept for audit).
        $this->assertSame(TaxTransactionService::ENTRY_VAT_OUT, $entries[0]->entry_type);
        $this->assertEquals(160.00, (float) $entries[0]->converted_amount);

        // A signed Balancing correction covers the difference.
        $this->assertSame(TaxTransactionService::ENTRY_BALANCING, $entries[1]->entry_type);
        $this->assertEquals(140.00, (float) $entries[1]->converted_amount);
        $this->assertEquals(300.00, (float) $entries[1]->running_balance);
    }

    public function test_deletion_reverses_position_via_balancing_entry(): void
    {
        ['invoice' => $invoice] = $this->invoice();

        TaxTransactionService::syncInvoicePosition($invoice);

        // Deleting the document withdraws its declared VAT.
        \DB::table('cust_invoices')->where('id', $invoice->id)->update(['is_deleted' => true]);
        $deleted = CustInvoice::withDeleted()->findOrFail($invoice->id);
        $deleted->status = 'draft';

        TaxTransactionService::syncInvoicePosition($deleted);

        $entries = TaxTransaction::query()->orderBy('id')->get();
        $this->assertCount(2, $entries);
        $this->assertSame(TaxTransactionService::ENTRY_VAT_OUT, $entries[0]->entry_type);
        $this->assertSame(TaxTransactionService::ENTRY_BALANCING, $entries[1]->entry_type);
        $this->assertEquals(-160.00, (float) $entries[1]->converted_amount);
        $this->assertEquals(0.00, (float) $entries[1]->running_balance);
    }

    public function test_credit_note_debits_and_company_invoice_input_vat_reduces_liability(): void
    {
        // Customer credit note (VAT_IN, debit) reduces the liability opened by an invoice.
        ['invoice' => $invoice] = $this->invoice();
        TaxTransactionService::syncInvoicePosition($invoice);

        $creditNoteId = \DB::table('cust_credit_notes')->insertGetId([
            'credit_note_number' => 'CN-1',
            'invoice_id' => $invoice->id,
            'currency' => 'KES',
            'tax_amount' => 160,
            'status' => 'raised',
            'created_at' => '2026-01-12 09:00:00',
        ]);

        $note = CustCreditNote::query()->findOrFail($creditNoteId);
        TaxTransactionService::syncCreditNotePosition($note);

        // Company invoice also holds recoverable VAT (VAT_IN).
        $companyInvoiceId = \DB::table('company_invoices')->insertGetId([
            'invoice_number' => 'CINV-1',
            'company_id' => \DB::table('companies')->insertGetId(['name' => 'Vendor', 'kra_pin' => 'P051000000B']),
            'currency' => 'KES',
            'tax_amount' => 240,
            'status' => 'sent',
            'created_at' => '2026-01-13 09:00:00',
        ]);

        $companyInvoice = CompanyInvoice::query()->findOrFail($companyInvoiceId);
        TaxTransactionService::syncCompanyInvoicePosition($companyInvoice);

        $entries = TaxTransaction::query()->orderBy('id')->get();
        $this->assertCount(3, $entries);

        $this->assertSame('VAT_OUT', $entries[0]->entry_type);
        $this->assertEquals(160.00, (float) $entries[0]->running_balance);

        $this->assertSame('VAT_IN', $entries[1]->entry_type);
        $this->assertSame('dr', $entries[1]->side);
        $this->assertEquals(-160.00, (float) $entries[1]->converted_amount);
        $this->assertEquals(0.00, (float) $entries[1]->running_balance);

        $this->assertSame('VAT_IN', $entries[2]->entry_type);
        $this->assertEquals(-240.00, (float) $entries[2]->converted_amount);
        $this->assertEquals(-240.00, (float) $entries[2]->running_balance);

        $this->assertSame('P051000000B', $entries[2]->kra_pin);
        $this->assertEquals($companyInvoice->company_id, (int) $entries[2]->supplier_or_customer);
    }

    public function test_vat_positions_and_listing_window_roll_correctly(): void
    {
        ['invoice' => $invoice] = $this->invoice();
        TaxTransactionService::syncInvoicePosition($invoice);

        $creditNoteId = \DB::table('cust_credit_notes')->insertGetId([
            'credit_note_number' => 'CN-1',
            'invoice_id' => $invoice->id,
            'currency' => 'KES',
            'tax_amount' => 60,
            'status' => 'raised',
            'created_at' => '2026-01-12 09:00:00',
        ]);
        TaxTransactionService::syncCreditNotePosition(
            CustCreditNote::query()->findOrFail($creditNoteId)
        );

        $positions = TaxTransactionService::vatPositions();
        $this->assertEquals(160.00, $positions['vat_out']);
        $this->assertEquals(60.00, $positions['vat_in']);
        $this->assertEquals(100.00, $positions['net']);

        // A window that starts after the invoice only rolls the credit note
        // from the opening balance (160).
        $listing = TaxTransactionService::ledgerListing('2026-01-12', null);
        $this->assertEquals(160.00, $listing['opening_balance']);
        $this->assertCount(1, $listing['entries']);
        $this->assertEquals(100.00, (float) $listing['entries'][0]->running_balance);
    }

    public function test_source_document_resolves_invoice_number_and_party(): void
    {
        ['invoice' => $invoice] = $this->invoice();
        TaxTransactionService::syncInvoicePosition($invoice);

        $entry = TaxTransaction::query()->sole();
        $document = $entry->sourceDocument();

        $this->assertSame('INV-1', $document['number']);
        $this->assertSame('customer', $document['party_type']);
        $this->assertSame('Acme Ltd', $document['party_name']);
        $this->assertSame('P051000000A', $document['kra_pin']);
        $this->assertEquals(160.00, $document['tax_amount']);
        $this->assertFalse($document['is_deleted']);
    }

    public function test_draft_documents_post_nothing(): void
    {
        ['invoice' => $invoice] = $this->invoice(['status' => 'draft']);
        TaxTransactionService::syncInvoicePosition($invoice);

        $this->assertCount(0, TaxTransaction::all());
        $this->assertEquals(0.0, TaxTransactionService::vatPositions()['net']);
    }

    public function test_index_endpoint_orders_entries_and_reports_running_balances(): void
    {
        \DB::table('users')->insert(['id' => 1, 'name' => 'Tester']);
        $user = User::query()->findOrFail(1);

        ['invoice' => $invoice] = $this->invoice();
        TaxTransactionService::syncInvoicePosition($invoice);

        $creditNoteId = \DB::table('cust_credit_notes')->insertGetId([
            'credit_note_number' => 'CN-1',
            'invoice_id' => $invoice->id,
            'currency' => 'KES',
            'tax_amount' => 60,
            'status' => 'raised',
            'created_at' => '2026-01-12 09:00:00',
        ]);
        TaxTransactionService::syncCreditNotePosition(
            CustCreditNote::query()->findOrFail($creditNoteId)
        );

        // Gate keeps the API testable without role setup.
        Gate::before(fn () => true);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/e-pms/api/v1/tax-transactions?from=2026-01-01&to=2026-01-31');

        $response->assertOk();
        $rows = $response->json('data');
        $this->assertCount(2, $rows);

        // Report columns: VAT columns split by entry side.
        $this->assertEquals(160.00, (float) $rows[0]['vat_out_cr']);
        $this->assertNull($rows[0]['vat_in_dr']);
        $this->assertEquals(60.00, (float) $rows[1]['vat_in_dr']);
        $this->assertNull($rows[1]['vat_out_cr']);

        // Report totals: CR (output) minus DR (input) is the liability.
        $totals = $response->json('totals');
        $this->assertEquals(160.00, $totals['vat_out_cr']);
        $this->assertEquals(60.00, $totals['vat_in_dr']);
        $this->assertEquals(100.00, $totals['vat_liability']);

        $response->assertJsonPath('data.0.source_document.number', 'INV-1');
        $response->assertJsonPath('data.1.source_document.number', 'CN-1');
        $response->assertJsonPath('data.0.kra_pin', 'P051000000A');
        $response->assertJsonPath('meta.total', 2);
    }

    public function test_summary_endpoint_reports_positions(): void
    {
        \DB::table('users')->insert(['id' => 1, 'name' => 'Tester']);
        $user = User::query()->findOrFail(1);

        ['invoice' => $invoice] = $this->invoice();
        TaxTransactionService::syncInvoicePosition($invoice);

        Gate::before(fn () => true);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/e-pms/api/v1/tax-transactions-summary');

        $response->assertOk();
        $cards = collect($response->json('data'))->keyBy('label');
        $this->assertEquals(160.00, $cards['vat_out']['total']);
        $this->assertEquals(0.00, $cards['vat_in']['total']);
        $this->assertEquals(160.00, $cards['net_position']['total']);
        $this->assertEquals(160.00, $cards['current_balance']['total']);
    }

    public function test_index_reports_amount_exclusive_converted_at_the_entry_rate(): void
    {
        \DB::table('users')->insert(['id' => 1, 'name' => 'Tester']);
        $user = User::query()->findOrFail(1);

        // USD invoice: net 25000 USD, tax 4000 USD (16%), rate 128.45.
        ['invoice' => $invoice] = $this->invoice([
            'currency' => 'USD',
            'forex_rate' => 128.45,
            'status' => 'sent',
        ]);
        \DB::table('cust_invoices')->where('id', $invoice->id)->update([
            'tax_amount' => 4000,
            'total_amount' => 29000,
        ]);
        $invoice = CustInvoice::query()->findOrFail($invoice->id);
        TaxTransactionService::syncInvoicePosition($invoice);

        Gate::before(fn () => true);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/e-pms/api/v1/tax-transactions?from=2026-01-01&to=2026-01-31')
            ->assertOk();

        $row = $response->json('data.0');

        // VAT column: 4000 USD x 128.45 = 513800 KES.
        $this->assertEquals(513800.00, (float) $row['vat_out_cr']);

        // Exclusive column must be KES too — same rate as the VAT.
        $this->assertEquals(3211250.00, (float) $row['amount_exclusive']);

        // And the totals row carries the KES exclusive.
        $this->assertEquals(3211250.00, $response->json('totals.amount_exclusive'));
    }

    public function test_index_reports_balancing_entries_at_statutory_split(): void
    {
        \DB::table('users')->insert(['id' => 1, 'name' => 'Tester']);
        $user = User::query()->findOrFail(1);

        ['invoice' => $invoice] = $this->invoice();
        TaxTransactionService::syncInvoicePosition($invoice);

        // Edit drops the tax to zero: a -160 balancing entry is posted.
        \DB::table('cust_invoices')->where('id', $invoice->id)->update(['tax_amount' => 0]);
        TaxTransactionService::syncInvoicePosition(
            CustInvoice::withDeleted()->findOrFail($invoice->id)
        );

        Gate::before(fn () => true);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/e-pms/api/v1/tax-transactions?from=2026-01-01&to=2026-01-31')
            ->assertOk();
        fwrite(STDERR, 'RESPONSE: '.json_encode($response->json('data')).PHP_EOL);
        $rows = collect($response->json('data'))
            ->values()
            ->all();
        $balancing = collect($rows)->firstWhere('entry_type', 'Balancing');
        $this->assertNotNull($balancing);
        $this->assertEquals(160.00, (float) $balancing['vat_in_dr']);

        // Corrections adjust the VAT only; the exclusive stays on the
        // original entry so window totals don't double-count.
        $this->assertEquals(0.00, (float) $balancing['amount_exclusive']);
    }

    public function test_credit_note_restatement_keeps_the_reduction_sign(): void
    {
        ['invoice' => $invoice] = $this->invoice();
        TaxTransactionService::syncInvoicePosition($invoice);

        // Raised credit note: posts VAT_IN −320.
        $noteId = \DB::table('cust_credit_notes')->insertGetId([
            'credit_note_number' => 'CCN-X',
            'invoice_id' => $invoice->id,
            'currency' => 'KES',
            'tax_amount' => 320,
            'status' => 'raised',
            'created_at' => '2026-01-12 09:00:00',
        ]);
        TaxTransactionService::syncCreditNotePosition(
            CustCreditNote::query()->findOrFail($noteId)
        );

        // The item hook re-syncs once the note is saved again (raised state):
        // a same-value restate must be a no-op — never a +640 flip.
        $note = CustCreditNote::query()->findOrFail($noteId);
        TaxTransactionService::syncCreditNotePosition($note);

        $net = (float) TaxTransaction::query()
            ->where('source_type', 'cust_credit_note')
            ->where('source_id', $noteId)
            ->sum('converted_amount');

        $this->assertEquals(-320.00, $net, 'Credit note restatement must keep the reduction on the debit side.');

        // A larger note tax must restate through a NEGATIVE balancing row.
        \DB::table('cust_credit_notes')->where('id', $noteId)->update(['tax_amount' => 480]);
        TaxTransactionService::syncCreditNotePosition(
            CustCreditNote::withDeleted()->findOrFail($noteId)
        );

        $net = (float) TaxTransaction::query()
            ->where('source_type', 'cust_credit_note')
            ->where('source_id', $noteId)
            ->sum('converted_amount');

        $this->assertEquals(-480.00, $net);

        $balancing = TaxTransaction::query()
            ->where('source_type', 'cust_credit_note')
            ->where('source_id', $noteId)
            ->where('entry_type', TaxTransactionService::ENTRY_BALANCING)
            ->first();
        $this->assertNotNull($balancing);
        $this->assertEquals(-160.00, (float) $balancing->converted_amount);
        $this->assertSame(TaxTransactionService::SIDE_DR, $balancing->side);
    }
}
