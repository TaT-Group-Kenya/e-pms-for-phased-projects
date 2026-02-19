<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number');
            $table->unsignedBigInteger('project_id');
            $table->unsignedBigInteger('company_id');
            $table->unsignedBigInteger('project_phase_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('status', ['draft', 'sent', 'paid', 'overdue', 'partially-paid', 'cancelled'])->default('draft');
            $table->decimal('subtotal_amount', 10, 2);
            $table->decimal('tax_percentage', 5, 2);
            $table->decimal('tax_amount', 10, 2);
            $table->decimal('discount_percentage', 5, 2);
            $table->decimal('discount_amount', 10, 2);
            $table->decimal('total_amount', 10, 2);
            $table->string('currency');
            $table->string('payment_terms')->nullable();
            $table->text('notes_to_customer')->nullable();
            $table->date('valid_until')->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_invoices');
    }
};