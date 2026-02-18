<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_number');
            $table->enum('transaction_type', ['payment','receipt','refund']);
            $table->date('transaction_date');
            $table->date('posted_date');
            $table->decimal('amount', 15, 2);
            $table->string('base_currency');
            $table->decimal('exchange_rate', 15, 6);
            $table->decimal('converted_amount', 15, 2);
            $table->decimal('tax_amount', 15, 2);
            $table->decimal('net_amount', 15, 2);
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->unsignedBigInteger('company_id')->nullable();
            $table->string('source_type');
            $table->unsignedBigInteger('source_id')->nullable();
            $table->string('account_debit')->nullable();
            $table->string('account_credit')->nullable();
            $table->enum('category', ['revenue','expense']);
            $table->string('payment_method')->nullable();
            $table->string('bank_account')->nullable();
            $table->string('check_number')->nullable();
            $table->enum('transaction_status', ['pending','cleared','reconciled','void']);
            $table->unsignedBigInteger('related_transaction_id')->nullable();
            $table->text('narration')->nullable();
            $table->boolean('is_recurring');
            $table->string('fiscal_year');
            $table->string('accounting_period');
            $table->boolean('is_adjusting_entry');
            $table->unsignedBigInteger('cost_center_id')->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};