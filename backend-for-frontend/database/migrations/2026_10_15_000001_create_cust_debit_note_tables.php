<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cust_debit_notes', function (Blueprint $table) {
            $table->id();
            $table->string('debit_note_number')->unique();
            $table->unsignedBigInteger('invoice_id')->index();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('status', ['draft', 'raised'])->default('draft');
            $table->decimal('subtotal_amount', 15, 2)->default(0);
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->string('currency');
            $table->text('notes_to_customer')->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->foreign('invoice_id')->references('id')->on('cust_invoices')->onDelete('cascade');
        });

        Schema::create('cust_debit_note_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('debit_note_id')->index();
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
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->foreign('debit_note_id')->references('id')->on('cust_debit_notes')->onDelete('cascade');
        });

        Schema::create('cust_debit_note_documents', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('debit_note_id')->index();
            $table->string('document_name');
            $table->string('document_path');
            $table->timestamp('created_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->foreign('debit_note_id')->references('id')->on('cust_debit_notes')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cust_debit_note_documents');
        Schema::dropIfExists('cust_debit_note_items');
        Schema::dropIfExists('cust_debit_notes');
    }
};
