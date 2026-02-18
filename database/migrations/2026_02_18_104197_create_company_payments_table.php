<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('transaction_id')->nullable();
            $table->unsignedBigInteger('invoice_id')->nullable();
            $table->decimal('amount_paid', 15, 2)->default(0);
            $table->date('payment_date')->nullable();
            $table->string('payment_method')->nullable();
            $table->enum('payment_status', ['pending','complete'])->default('complete');
            $table->string('currency');
            $table->decimal('exchange_rate', 15, 6)->nullable();
            $table->string('bank_name')->nullable();
            $table->string('check_number')->nullable();
            $table->string('transaction_reference')->nullable();
            $table->string('receipt_number')->nullable();
            $table->boolean('reconciled')->default(false);
            $table->date('reconciliation_date')->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_payments');
    }
};
