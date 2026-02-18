<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cust_invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number');
            $table->unsignedBigInteger('order_id');
            $table->unsignedBigInteger('project_id');
            $table->unsignedBigInteger('customer_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('status', ['draft','sent','paid','partial-paid'])->default('draft');
            $table->decimal('subtotal_amount', 15, 2);
            $table->decimal('tax_percentage', 8, 2);
            $table->decimal('tax_amount', 15, 2);
            $table->decimal('discount_percentage', 8, 2);
            $table->decimal('discount_amount', 15, 2);
            $table->decimal('total_amount', 15, 2);
            $table->string('currency');
            $table->text('payment_terms')->nullable();
            $table->text('notes_to_customer')->nullable();
            $table->date('valid_until');
            $table->timestamps();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();

            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cust_invoices');
    }
};