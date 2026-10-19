<?php

namespace Tests\Feature;

use App\Models\CustInvoice;
use App\Models\CustomerTransactionsLedger;
use App\Models\SysConfig;
use App\Models\User;
use App\Services\CustDebitNoteItemService;
use App\Services\CustDebitNoteService;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class CustDebitNoteTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Schema::dropIfExists('cust_debit_note_items');
        Schema::dropIfExists('cust_debit_note_documents');
        Schema::dropIfExists('cust_debit_notes');
        Schema::dropIfExists('customer_transactions_ledger');
        Schema::dropIfExists('cust_invoices');
        Schema::dropIfExists('customers');
        Schema::dropIfExists('sys_configs');

        Schema::create('sys_configs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('value');
            $table->boolean('readonly')->default(false);
            $table->boolean('is_file')->default(false);
        });
        foreach ([
            ['name' => 'CUST_DEBIT_NOTE_PREFIX', 'value' => 'CDN-'],
            ['name' => 'CUST_DEBIT_NOTE_INCREMENT', 'value' => '1'],
            ['name' => 'CUST_DEBIT_NOTE_NUMBER_LENGTH', 'value' => '6'],
        ] as $config) {
            SysConfig::create($config);
        }

        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->boolean('is_deleted')->default(false);
        });
        DB::table('customers')->insert([
            ['id' => 42, 'name' => 'Customer 42', 'email' => 'customer42@example.test', 'is_deleted' => false],
            ['id' => 43, 'name' => 'Customer 43', 'email' => 'customer43@example.test', 'is_deleted' => false],
            ['id' => 44, 'name' => 'Customer 44', 'email' => 'customer44@example.test', 'is_deleted' => false],
        ]);
        Schema::create('cust_invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number');
            $table->unsignedBigInteger('customer_id');
            $table->string('currency');
            $table->string('status')->default('draft');
            $table->timestamps();
            $table->boolean('is_deleted')->default(false);
        });
        Schema::create('cust_invoice_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('invoice_id');
            $table->timestamps();
            $table->boolean('is_deleted')->default(false);
        });
        Schema::create('cust_payment_allocations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('payment_id');
            $table->unsignedBigInteger('invoice_id');
            $table->boolean('is_deleted')->default(false);
        });
        Schema::create('cust_payments', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_number')->nullable();
            $table->string('transaction_type')->nullable();
            $table->decimal('amount_paid', 15, 2)->default(0);
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('net_amount', 15, 2)->default(0);
            $table->date('payment_date')->nullable();
            $table->string('payment_method')->nullable();
            $table->string('payment_status')->nullable();
            $table->string('currency')->nullable();
            $table->string('payment_type')->nullable();
            $table->decimal('invoice_total_amount', 15, 2)->default(0);
            $table->decimal('fee_or_charge', 15, 2)->default(0);
            $table->boolean('reconciled')->default(false);
            $table->timestamps();
            $table->boolean('is_deleted')->default(false);
        });
        Schema::create('cust_credit_notes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('invoice_id');
            $table->timestamps();
            $table->boolean('is_deleted')->default(false);
        });
        Schema::create('cust_invoice_documents', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('invoice_id');
            $table->timestamps();
            $table->boolean('is_deleted')->default(false);
        });
        Schema::create('pdc_received_customers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('invoice_id')->nullable();
            $table->timestamps();
            $table->boolean('is_deleted')->default(false);
        });
        Schema::create('cust_debit_notes', function (Blueprint $table) {
            $table->id();
            $table->string('debit_note_number')->unique();
            $table->unsignedBigInteger('invoice_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('status')->default('draft');
            $table->decimal('subtotal_amount', 15, 2)->default(0);
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->string('currency');
            $table->text('notes_to_customer')->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });
        Schema::create('cust_debit_note_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('debit_note_id');
            $table->string('item_name');
            $table->text('item_description')->nullable();
            $table->decimal('item_amount', 15, 2);
            $table->unsignedInteger('quantity')->default(1);
            $table->decimal('total', 15, 2)->default(0);
            $table->boolean('is_taxable')->default(false);
            $table->unsignedBigInteger('tax_id')->nullable();
            $table->string('tax_item_name')->nullable();
            $table->string('item_type')->nullable();
            $table->decimal('item_value', 15, 4)->nullable();
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->text('custom_note')->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });
        Schema::create('cust_debit_note_documents', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('debit_note_id');
            $table->string('document_name');
            $table->string('document_path');
            $table->timestamps();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });
        Schema::create('customer_transactions_ledger', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_number')->unique();
            $table->string('transaction_type');
            $table->date('transaction_date');
            $table->date('posted_date');
            $table->decimal('amount', 15, 2);
            $table->string('transaction_currency');
            $table->string('base_currency');
            $table->decimal('exchange_rate', 15, 6);
            $table->decimal('converted_amount', 15, 2);
            $table->decimal('converted_tax_amount', 15, 2);
            $table->decimal('converted_net_amount', 15, 2);
            $table->decimal('tax_amount', 15, 2);
            $table->decimal('net_amount', 15, 2);
            $table->unsignedBigInteger('customer_id');
            $table->string('source_type');
            $table->unsignedBigInteger('source_id')->nullable();
            $table->string('account_debit')->nullable();
            $table->string('account_credit')->nullable();
            $table->string('category');
            $table->string('transaction_status');
            $table->text('narration')->nullable();
            $table->boolean('is_recurring');
            $table->string('fiscal_year');
            $table->string('accounting_period');
            $table->boolean('is_adjusting_entry');
            $table->unsignedBigInteger('cost_center_id')->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });
    }

    public function test_draft_items_recalculate_and_raising_posts_one_ledger_entry(): void
    {
        $invoice = CustInvoice::create([
            'invoice_number' => 'INV-1',
            'customer_id' => 42,
            'currency' => 'KES',
            'status' => 'sent',
        ]);
        $service = new CustDebitNoteService;
        $note = $service->create([
            'invoice_id' => $invoice->id,
            'title' => 'Debit adjustment',
        ]);

        $item = (new CustDebitNoteItemService)->create([
            'debit_note_id' => $note->id,
            'item_name' => 'Additional work',
            'item_amount' => 100,
            'quantity' => 2,
            'is_taxable' => true,
            'item_type' => 'percent',
            'item_value' => 16,
        ]);

        $note->refresh();
        $this->assertSame(200.0, (float) $note->subtotal_amount);
        $this->assertSame(32.0, (float) $note->tax_amount);
        $this->assertSame(232.0, (float) $note->total_amount);
        $this->assertSame(32.0, (float) $item->tax_amount);

        $raised = $service->update($note->id, ['status' => 'raised']);
        $this->assertSame('raised', $raised->status);
        $this->assertSame(1, CustomerTransactionsLedger::where('source_type', 'customer_debit_note')->count());
        $ledger = CustomerTransactionsLedger::firstOrFail();
        $this->assertSame('invoice', $ledger->transaction_type);
        $this->assertSame(42, $ledger->customer_id);
        $this->assertSame(32.0, (float) $ledger->tax_amount);
        $this->assertSame(200.0, (float) $ledger->net_amount);

        try {
            $service->update($note->id, ['status' => 'draft']);
            $this->fail('Raised notes should not be reversible.');
        } catch (ValidationException) {
            $this->assertSame(1, CustomerTransactionsLedger::where('source_type', 'customer_debit_note')->count());
        }

        try {
            (new CustDebitNoteItemService)->update($item->id, ['item_amount' => 99]);
            $this->fail('Raised note items should be locked.');
        } catch (ValidationException) {
            $this->assertSame(1, CustomerTransactionsLedger::where('source_type', 'customer_debit_note')->count());
        }
        $this->assertDatabaseHas('cust_debit_notes', ['id' => $note->id, 'status' => 'raised']);
    }

    public function test_invoice_currency_cannot_be_overridden(): void
    {
        $invoice = CustInvoice::create([
            'invoice_number' => 'INV-2',
            'customer_id' => 43,
            'currency' => 'KES',
            'status' => 'sent',
        ]);

        try {
            (new CustDebitNoteService)->create([
                'invoice_id' => $invoice->id,
                'title' => 'Invalid currency',
                'currency' => 'USD',
            ]);
            $this->fail('Cross-currency override should be rejected.');
        } catch (ValidationException) {
            $this->assertDatabaseCount('cust_debit_notes', 0);
        }
    }

    public function test_draft_invoices_are_not_eligible_for_debit_notes(): void
    {
        $invoice = CustInvoice::create([
            'invoice_number' => 'INV-3',
            'customer_id' => 42,
            'currency' => 'KES',
            'status' => 'draft',
        ]);

        try {
            (new CustDebitNoteService)->create([
                'invoice_id' => $invoice->id,
                'title' => 'Debit against draft invoice',
            ]);
            $this->fail('Draft invoices should not be eligible for debit notes.');
        } catch (ValidationException $exception) {
            $this->assertStringContainsString(
                'issued to the customer',
                (string) $exception->errors()['invoice_id'][0],
            );
        }
        $this->assertDatabaseCount('cust_debit_notes', 0);
    }

    public function test_debit_note_numbers_follow_configured_sequence(): void
    {
        $invoice = CustInvoice::create([
            'invoice_number' => 'INV-4',
            'customer_id' => 43,
            'currency' => 'KES',
            'status' => 'sent',
        ]);

        $first = (new CustDebitNoteService)->create([
            'invoice_id' => $invoice->id,
            'title' => 'Sequence check one',
        ]);
        $second = (new CustDebitNoteService)->create([
            'invoice_id' => $invoice->id,
            'title' => 'Sequence check two',
        ]);

        $this->assertMatchesRegularExpression('/^CDN-\d{6}$/', $first->debit_note_number);
        $this->assertMatchesRegularExpression('/^CDN-\d{6}$/', $second->debit_note_number);
        $this->assertNotSame($first->debit_note_number, $second->debit_note_number);
        $this->assertSame(
            (int) substr($second->debit_note_number, -6),
            (int) substr($first->debit_note_number, -6) + 1,
        );
    }

    public function test_debit_notes_are_exposed_on_the_invoice_show_resource(): void
    {
        $invoice = CustInvoice::create([
            'invoice_number' => 'INV-DN-TAB',
            'customer_id' => 42,
            'currency' => 'KES',
            'status' => 'sent',
        ]);

        $note = (new CustDebitNoteService)->create([
            'invoice_id' => $invoice->id,
            'title' => 'Visible from invoice',
        ]);
        (new CustDebitNoteItemService)->create([
            'debit_note_id' => $note->id,
            'item_name' => 'Extra work',
            'item_amount' => 50,
            'quantity' => 1,
            'is_taxable' => false,
        ]);

        Gate::before(fn () => true);
        $user = new User;
        $user->id = 1;
        $this->actingAs($user, 'sanctum');

        $response = $this->getJson(route('cust-invoices.show', $invoice));
        $response->assertOk();

        $debitNotes = $response->json('data.debitnotes');
        $this->assertIsArray($debitNotes);
        $this->assertCount(1, $debitNotes);
        $this->assertSame('Visible from invoice', $debitNotes[0]['title']);
        $this->assertSame('draft', $debitNotes[0]['status']);
        $this->assertSame(50.0, (float) $debitNotes[0]['total_amount']);
    }

    public function test_debit_note_document_upload_replacement_and_deletion_clean_files(): void
    {
        $invoice = CustInvoice::create([
            'invoice_number' => 'INV-DOC',
            'customer_id' => 44,
            'currency' => 'KES',
            'status' => 'sent',
        ]);
        $note = (new CustDebitNoteService)->create([
            'invoice_id' => $invoice->id,
            'title' => 'Document upload',
        ]);

        Gate::before(fn () => true);
        $user = new User;
        $user->id = 1;
        $this->actingAs($user, 'sanctum');
        Storage::fake('public');

        $response = $this->post(route('cust-debit-note-documents.store'), [
            'debit_note_id' => $note->id,
            'document_file' => UploadedFile::fake()->image('initial.png'),
        ]);
        $response->assertCreated();
        $firstPath = $response->json('data.document_path');
        $this->assertNotEmpty($firstPath);
        Storage::disk('public')->assertExists($firstPath);

        $replacement = $this->patch(route('cust-debit-note-documents.update', $response->json('data.id')), [
            'document_file' => UploadedFile::fake()->image('replacement.png'),
        ]);
        $replacement->assertOk();
        $newPath = $replacement->json('data.document_path');
        $this->assertNotSame($firstPath, $newPath);
        Storage::disk('public')->assertMissing($firstPath);
        Storage::disk('public')->assertExists($newPath);

        $this->delete(route('cust-debit-note-documents.destroy', $response->json('data.id')))->assertNoContent();
        Storage::disk('public')->assertMissing($newPath);
    }
}
