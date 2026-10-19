<?php

namespace Tests\Feature;

use App\Models\CompanyInvoice;
use App\Models\CompanyPayment;
use App\Models\PdcIssuedCompany;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class CompanyInvoiceStatusReconcileTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Schema::dropIfExists('pdc_issued_companies');
        Schema::dropIfExists('company_invoice_items');
        Schema::dropIfExists('company_invoices');
        Schema::dropIfExists('company_transactions_ledger');
        Schema::dropIfExists('company_payments');
        Schema::dropIfExists('downloads');

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

        Schema::create('pdc_issued_companies', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_number')->nullable();
            $table->unsignedBigInteger('company_id')->nullable();
            $table->unsignedBigInteger('invoice_id')->nullable();
            $table->decimal('forex_rate', 15, 6)->nullable();
            $table->string('cheque_number')->nullable();
            $table->date('cheque_date')->nullable();
            $table->date('issued_date')->nullable();
            $table->decimal('amount', 15, 2)->default(0);
            $table->string('currency')->default('KES');
            $table->string('bank')->nullable();
            $table->string('bank_branch')->nullable();
            $table->unsignedBigInteger('bank_account_id')->nullable();
            $table->string('status')->default('issued');
            $table->text('narration')->nullable();
            $table->unsignedBigInteger('related_transaction_id')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });
    }

    protected function tearDown(): void
    {
        Schema::dropIfExists('pdc_issued_companies');
        Schema::dropIfExists('company_invoice_items');
        Schema::dropIfExists('company_invoices');
        Schema::dropIfExists('company_transactions_ledger');
        Schema::dropIfExists('company_payments');
        Schema::dropIfExists('downloads');

        parent::tearDown();
    }

    protected function makePaidInvoiceWithPayments(float $total): CompanyInvoice
    {
        $invoice = CompanyInvoice::create([
            'invoice_number' => 'CINV-PDC-'.uniqid(),
            'company_id' => 1,
            'title' => 'Paid invoice',
            'status' => 'paid',
            'subtotal_amount' => $total,
            'tax_amount' => 0,
            'discount_percentage' => 0,
            'discount_amount' => 0,
            'total_amount' => $total,
            'currency' => 'KES',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        CompanyPayment::create([
            'invoice_id' => $invoice->id,
            'direction' => 'outgoing',
            'amount_paid' => $total,
            'payment_date' => now(),
            'payment_method' => 'cash',
            'payment_status' => 'complete',
            'currency' => 'KES',
            'payment_type' => 'normal',
        ]);

        return $invoice;
    }

    public function test_paid_invoice_moves_back_to_partially_paid_when_total_exceeds_received(): void
    {
        $invoice = $this->makePaidInvoiceWithPayments(100);
        $this->assertSame('paid', $invoice->status);

        // Simulate an item edit that raises the total to 250.
        $invoice->total_amount = 250;
        $invoice->save();
        $invoice->syncDerivedAmounts();

        $invoice->refresh();
        $this->assertSame('partially-paid', $invoice->status);
    }

    public function test_paid_invoice_moves_back_to_partially_paid_when_total_exceeds_received_including_pending_pdcs(): void
    {
        $invoice = $this->makePaidInvoiceWithPayments(100);

        // An *uncleared* PDC still reserves part of the total.
        PdcIssuedCompany::create([
            'transaction_number' => 'PDC-1',
            'company_id' => 1,
            'invoice_id' => $invoice->id,
            'amount' => 100,
            'status' => 'issued',
            'created_at' => now(),
        ]);

        // An already cleared PDC has become a real payment.
        PdcIssuedCompany::create([
            'transaction_number' => 'PDC-2',
            'company_id' => 1,
            'invoice_id' => $invoice->id,
            'amount' => 40,
            'status' => 'cleared',
            'created_at' => now(),
        ]);

        // Raise the total above payments + pending PDCs but below payments +
        // pending PDCs + cleared PDC double counting is impossible because the
        // cleared cheque posted a real payment with direction outgoing.
        $invoice->total_amount = 150;
        $invoice->save();
        $invoice->syncDerivedAmounts();

        $invoice->refresh();
        // 100 paid; pending PDC of 100 reserved => remaining > 0.
        $this->assertSame('partially-paid', $invoice->status);
    }

    public function test_paid_invoice_stays_paid_when_total_matches_payments(): void
    {
        $invoice = $this->makePaidInvoiceWithPayments(300);
        $this->assertSame('paid', $invoice->status);

        // A no-op edit (same total) must not disturb the paid status.
        $invoice->total_amount = 300;
        $invoice->save();
        $invoice->syncDerivedAmounts();

        $invoice->refresh();
        $this->assertSame('paid', $invoice->status);
    }

    public function test_paid_invoice_reverts_fully_paid_status_only_from_real_payments(): void
    {
        $invoice = $this->makePaidInvoiceWithPayments(100);

        // A pending PDC alone does not make the invoice paid; it only reserves
        // balance in the payment flow. Remove the real payment to simulate that
        // only a pending PDC remains against a higher total.
        CompanyPayment::where('invoice_id', $invoice->id)->delete();

        $invoice->total_amount = 150;
        $invoice->save();
        $invoice->syncDerivedAmounts();

        $invoice->refresh();
        $this->assertSame('sent', $invoice->status);
    }
}
