<?php

namespace Tests\Feature;

use App\Models\CompanyInvoice;
use App\Models\CompanyInvoiceItem;
use App\Models\CompanyPayment;
use App\Models\CompanyTransactionsLedger;
use App\Models\Download;
use App\Models\ProjectPhase;
use App\Services\CompanyInvoiceItemService;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class CompanyInvoiceItemEditTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Schema::dropIfExists('company_invoice_items');
        Schema::dropIfExists('company_invoices');
        Schema::dropIfExists('company_transactions_ledger');
        Schema::dropIfExists('company_payments');
        Schema::dropIfExists('downloads');
        Schema::dropIfExists('project_phases');

        Schema::create('project_phases', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('project_id');
            $table->string('name')->nullable();
            $table->boolean('is_billed')->default(false);
            $table->timestamps();
            $table->boolean('is_deleted')->default(false);
        });
        DB::table('project_phases')->insert([
            ['id' => 7, 'project_id' => 1, 'name' => 'Phase A', 'is_billed' => false, 'is_deleted' => false, 'created_at' => now(), 'updated_at' => now()],
        ]);

        Schema::create('company_invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number');
            $table->unsignedBigInteger('project_id')->nullable();
            $table->unsignedBigInteger('company_id');
            $table->unsignedBigInteger('project_phase_id')->nullable();
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->string('status')->default('draft');
            $table->decimal('subtotal_amount', 15, 2)->default(0);
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('discount_percentage', 5, 2)->default(0);
            $table->decimal('discount_amount', 15, 2)->default(0);
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->string('currency');
            $table->string('payment_terms')->nullable();
            $table->text('notes_to_customer')->nullable();
            $table->date('valid_until')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });

        Schema::create('company_invoice_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('invoice_id');
            $table->unsignedBigInteger('project_phase_id')->nullable();
            $table->string('item_name');
            $table->text('item_description')->nullable();
            $table->decimal('item_amount', 15, 2)->default(0);
            $table->integer('quantity')->default(1);
            $table->decimal('total', 15, 2)->nullable();
            $table->boolean('is_taxable')->default(false);
            $table->unsignedBigInteger('tax_id')->nullable();
            $table->string('tax_item_name')->nullable();
            $table->string('item_type')->nullable();
            $table->decimal('item_value', 15, 4)->nullable();
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });

        Schema::create('company_payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('transaction_id')->nullable();
            $table->string('transaction_number')->nullable();
            $table->unsignedBigInteger('invoice_id')->nullable();
            $table->string('direction')->default('outgoing');
            $table->string('transaction_type')->nullable();
            $table->decimal('amount_paid', 15, 2)->default(0);
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('net_amount', 15, 2)->default(0);
            $table->date('payment_date')->nullable();
            $table->string('payment_method')->nullable();
            $table->string('payment_status')->default('complete');
            $table->string('currency')->default('KES');
            $table->string('bank_name')->nullable();
            $table->string('check_number')->nullable();
            $table->string('transaction_reference')->nullable();
            $table->string('receipt_number')->nullable();
            $table->boolean('reconciled')->default(false);
            $table->date('reconciliation_date')->nullable();
            $table->string('payment_type')->default('normal');
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });

        Schema::create('company_transactions_ledger', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('company_payment_id')->nullable();
            $table->string('transaction_number')->nullable();
            $table->string('transaction_type');
            $table->date('transaction_date')->nullable();
            $table->date('posted_date')->nullable();
            $table->decimal('amount', 15, 2)->default(0);
            $table->string('transaction_currency')->default('KES');
            $table->string('base_currency')->default('KES');
            $table->decimal('exchange_rate', 15, 6)->default(1);
            $table->decimal('converted_amount', 15, 2)->default(0);
            $table->decimal('converted_tax_amount', 15, 2)->default(0);
            $table->decimal('converted_net_amount', 15, 2)->default(0);
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('net_amount', 15, 2)->default(0);
            $table->unsignedBigInteger('company_id')->nullable();
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->string('source_type');
            $table->unsignedBigInteger('source_id')->nullable();
            $table->unsignedBigInteger('account_debit')->nullable();
            $table->unsignedBigInteger('account_credit')->nullable();
            $table->string('category')->default('expense');
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

        Schema::create('downloads', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('path');
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
        });
    }

    protected function tearDown(): void
    {
        Schema::dropIfExists('company_invoice_items');
        Schema::dropIfExists('company_invoices');
        Schema::dropIfExists('company_transactions_ledger');
        Schema::dropIfExists('company_payments');
        Schema::dropIfExists('downloads');
        Schema::dropIfExists('project_phases');

        parent::tearDown();
    }

    protected function makeInvoice(string $status = 'sent', array $overrides = []): CompanyInvoice
    {
        return CompanyInvoice::create(array_merge([
            'invoice_number' => 'CINV-'.uniqid(),
            'company_id' => 1,
            'title' => 'Test invoice',
            'status' => $status,
            'subtotal_amount' => 0,
            'tax_amount' => 0,
            'discount_percentage' => 0,
            'discount_amount' => 0,
            'total_amount' => 0,
            'currency' => 'KES',
            'created_at' => now(),
            'updated_at' => now(),
        ], $overrides));
    }

    protected function makeInvoiceLedger(CompanyInvoice $invoice): CompanyTransactionsLedger
    {
        return CompanyTransactionsLedger::create([
            'transaction_number' => $invoice->invoice_number,
            'transaction_type' => 'invoice',
            'transaction_date' => now(),
            'posted_date' => now(),
            'amount' => (float) $invoice->total_amount,
            'tax_amount' => (float) $invoice->tax_amount,
            'net_amount' => (float) $invoice->subtotal_amount,
            'company_id' => $invoice->company_id,
            'source_type' => 'company_invoice',
            'source_id' => $invoice->id,
            'category' => 'expense',
            'transaction_status' => 'cleared',
        ]);
    }

    public function test_item_edit_on_sent_invoice_updates_totals_and_invoice_ledger_row(): void
    {
        Storage::fake('public');

        $invoice = $this->makeInvoice('sent');
        (new CompanyInvoiceItemService)->create([
            'invoice_id' => $invoice->id,
            'item_name' => 'Initial work',
            'item_amount' => 100,
            'quantity' => 1,
            'is_taxable' => true,
            'item_type' => 'percent',
            'item_value' => 16,
        ]);
        $invoice->refresh();
        $ledger = $this->makeInvoiceLedger($invoice);
        $this->assertSame(116.0, (float) $ledger->amount); // sanity: model sync runs on create

        $item = CompanyInvoiceItem::where('invoice_id', $invoice->id)->firstOrFail();

        // Second item raises the invoice totals and must flow into the ledger.
        $second = (new CompanyInvoiceItemService)->create([
            'invoice_id' => $invoice->id,
            'item_name' => 'Extra work',
            'item_amount' => 50,
            'quantity' => 2,
            'is_taxable' => false,
        ]);

        $invoice->refresh();
        $this->assertSame(200.0, (float) $invoice->subtotal_amount);
        $this->assertSame(16.0, (float) $invoice->tax_amount);
        $this->assertSame(216.0, (float) $invoice->total_amount);
        $this->assertSame('sent', $invoice->status);

        $ledger->refresh();
        $this->assertSame(216.0, (float) $ledger->amount);
        $this->assertSame(16.0, (float) $ledger->tax_amount);
        $this->assertSame(200.0, (float) $ledger->net_amount);

        // Editing an existing item on a non-draft invoice also syncs.
        // item1: 120 x1 = 120 + 19.2 tax; item2: 50 x2 = 100 -> total 239.2.
        (new CompanyInvoiceItemService)->update($item->id, ['item_amount' => 120]);
        $invoice->refresh();
        $this->assertSame(239.2, (float) $invoice->total_amount);
        $ledger->refresh();
        $this->assertSame(239.2, (float) $ledger->amount);

        // Cached PDF gets invalidated.
        Storage::disk('public')->put('company-invoices/stale.pdf', 'old pdf bytes');
        $download = new Download;
        $download->name = $invoice->invoice_number;
        $download->path = 'company-invoices/stale.pdf';
        $download->save();

        (new CompanyInvoiceItemService)->update($item->id, ['item_amount' => 121]);
        Storage::disk('public')->assertMissing('company-invoices/stale.pdf');
    }

    public function test_totals_change_beyond_paid_amount_reconciles_status(): void
    {
        $invoice = $this->makeInvoice('sent', ['project_phase_id' => 7]);
        (new CompanyInvoiceItemService)->create([
            'invoice_id' => $invoice->id,
            'project_phase_id' => 7,
            'item_name' => 'Work',
            'item_amount' => 100,
            'quantity' => 1,
            'is_taxable' => false,
        ]);

        CompanyPayment::create([
            'invoice_id' => $invoice->id,
            'direction' => 'outgoing',
            'amount_paid' => 100,
            'payment_date' => now(),
            'payment_method' => 'cash',
            'payment_status' => 'complete',
            'currency' => 'KES',
            'payment_type' => 'normal',
        ]);
        $invoice->refresh();
        $invoice->status = 'paid';
        $invoice->save();

        // Raise the invoice total above what was paid -> becomes partially-paid.
        (new CompanyInvoiceItemService)->update(
            (int) $invoice->invoiceItems()->first()->id,
            ['item_amount' => 150]
        );
        $invoice->refresh();
        $this->assertSame('partially-paid', $invoice->status);

        // Pay the difference. Lower the item so the 100 already paid covers the
        // total again -> status returns to paid and phases are billed.
        (new CompanyInvoiceItemService)->update(
            (int) $invoice->invoiceItems()->first()->id,
            ['item_amount' => 99]
        );
        $invoice->refresh();
        $this->assertSame(99.0, (float) $invoice->total_amount);
        $this->assertSame('paid', $invoice->status);
        $this->assertSame(1, (int) ProjectPhase::where('is_billed', true)->count());

        // Lower the total further below the paid amount keeps paid.
        (new CompanyInvoiceItemService)->update(
            (int) $invoice->invoiceItems()->first()->id,
            ['item_amount' => 40]
        );
        $invoice->refresh();
        $this->assertSame('paid', $invoice->status);
    }

    public function test_cancelled_invoice_rejects_item_add_and_edit(): void
    {
        // Item exists from before the invoice was cancelled.
        $invoice = $this->makeInvoice('sent');
        $item = (new CompanyInvoiceItemService)->create([
            'invoice_id' => $invoice->id,
            'item_name' => 'Before cancel',
            'item_amount' => 10,
            'quantity' => 1,
            'is_taxable' => false,
        ]);

        $invoice->status = 'cancelled';
        $invoice->save();

        try {
            (new CompanyInvoiceItemService)->create([
                'invoice_id' => $invoice->id,
                'item_name' => 'After cancel',
                'item_amount' => 10,
                'quantity' => 1,
                'is_taxable' => false,
            ]);
            $this->fail('Cancelled invoices must reject item creation.');
        } catch (ValidationException $exception) {
            $this->assertStringContainsString('cancelled', (string) $exception->errors()['invoice_id'][0]);
        }

        try {
            (new CompanyInvoiceItemService)->update($item->id, ['item_amount' => 999]);
            $this->fail('Cancelled invoices must reject item edits.');
        } catch (ValidationException $exception) {
            $this->assertStringContainsString('cancelled', (string) $exception->errors()['invoice_id'][0]);
        }
    }

    public function test_item_deletion_is_still_limited_to_draft_invoices(): void
    {
        $invoice = $this->makeInvoice('sent');
        $item = (new CompanyInvoiceItemService)->create([
            'invoice_id' => $invoice->id,
            'item_name' => 'Locked line',
            'item_amount' => 20,
            'quantity' => 1,
            'is_taxable' => false,
        ]);

        try {
            (new CompanyInvoiceItemService)->delete($item->id);
            $this->fail('Deleting an item on a sent invoice must be rejected.');
        } catch (ValidationException $exception) {
            $this->assertStringContainsString('draft', (string) $exception->errors()['invoice_id'][0]);
        }

        // Draft invoices can still delete items.
        $draft = $this->makeInvoice('draft');
        $draftItem = (new CompanyInvoiceItemService)->create([
            'invoice_id' => $draft->id,
            'item_name' => 'Draft line',
            'item_amount' => 20,
            'quantity' => 1,
            'is_taxable' => false,
        ]);
        (new CompanyInvoiceItemService)->delete($draftItem->id);

        $this->assertSame(0, (int) CompanyInvoiceItem::where('invoice_id', $draft->id)->count());
    }

    public function test_draft_and_cancelled_invoices_keep_status_during_item_changes(): void
    {
        $invoice = $this->makeInvoice('draft');
        (new CompanyInvoiceItemService)->create([
            'invoice_id' => $invoice->id,
            'item_name' => 'Draft work',
            'item_amount' => 80,
            'quantity' => 1,
            'is_taxable' => false,
        ]);
        $invoice->refresh();
        $this->assertSame('draft', $invoice->status);
        $this->assertSame(80.0, (float) $invoice->total_amount);
    }
}
