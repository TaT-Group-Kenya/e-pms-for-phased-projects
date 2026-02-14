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

            $table->unsignedBigInteger('transaction_id');
            $table->unsignedBigInteger('invoice_id');

            $table->decimal('amount_paid', 15, 2);

            $table->date('payment_date');

            $table->enum('payment_method', ['cash','mpesa','bank_transfer','check']);
            $table->enum('payment_status', ['pending','complete']);

            $table->string('currency');
            $table->decimal('exchange_rate', 15, 6);

            $table->string('bank_name')->nullable();
            $table->string('check_number')->nullable();
            $table->string('transaction_reference')->nullable();

            $table->string('receipt_number');

            $table->boolean('reconciled');

            $table->date('reconciliation_date')->nullable();

            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

            $table->timestamp('created_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_payments');
    }
};