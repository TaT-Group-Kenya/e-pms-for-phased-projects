<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cust_payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('transaction_id');
            $table->decimal('amount_paid', 15, 2);
            $table->date('payment_date');
            $table->enum('payment_method', ['cash','mpesa','bank_transfer','check']);
            $table->enum('payment_status', ['pending','complete']);
            $table->string('currency');
            $table->string('bank_name')->nullable();
            $table->string('check_number')->nullable();
            $table->string('transaction_reference')->nullable();
            $table->string('receipt_number');
            $table->decimal('invoice_total_amount', 15, 2);
            $table->decimal('exchange_rate', 15, 6);
            $table->decimal('fee_or_charge', 15, 2);
            $table->boolean('reconciled');
            $table->date('reconciliation_date')->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            
            $table->foreign('transaction_id')->references('id')->on('cust_invoices')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cust_payments');
    }
};