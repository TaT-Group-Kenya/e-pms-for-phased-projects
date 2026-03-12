<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('office_expense_payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('expense_id');
            $table->unsignedBigInteger('transaction_id')->nullable();
            $table->string('transaction_number')->nullable();
            $table->string('direction')->nullable();
            $table->string('transaction_type')->nullable();
            $table->decimal('amount_paid', 15, 2);
            $table->decimal('tax_amount', 15, 2)->nullable();
            $table->decimal('net_amount', 15, 2)->nullable();
            $table->date('payment_date');
            $table->string('payment_method')->nullable();
            $table->string('payment_status')->nullable();
            $table->string('currency', 10);
            $table->decimal('exchange_rate', 15, 6)->nullable();
            $table->string('bank_name')->nullable();
            $table->string('check_number')->nullable();
            $table->string('transaction_reference')->nullable();
            $table->string('receipt_number')->nullable();
            $table->boolean('reconciled')->default(false);
            $table->date('reconciliation_date')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->boolean('is_deleted')->default(false);
            $table->softDeletes();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->foreign('expense_id')->references('id')->on('office_expenses')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('office_expense_payments');
    }
};
