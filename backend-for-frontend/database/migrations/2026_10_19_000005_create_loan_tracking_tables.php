<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loans', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('account_id');
            $table->string('lender_name');
            $table->decimal('principal', 15, 2);
            $table->string('currency', 10);
            $table->enum('interest_type', ['none', 'flat', 'reducing'])->default('none');
            $table->decimal('interest_rate', 8, 4)->default(0); // % per annum
            $table->unsignedInteger('tenure_months')->default(1);
            $table->enum('repayment_frequency', ['monthly', 'quarterly', 'weekly'])->default('monthly');
            $table->date('disbursement_date');
            $table->date('first_payment_date')->nullable();
            $table->decimal('installment_amount', 15, 2)->nullable(); // computed on approval
            $table->enum('status', ['pending_disbursement', 'active', 'closed', 'restructured'])->default('pending_disbursement');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('disbursement_transaction_id')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->foreign('account_id')->references('id')->on('accounts');
            $table->foreign('disbursement_transaction_id')->references('id')->on('transactions');
            $table->index(['account_id', 'status']);
        });

        Schema::create('loan_schedules', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('loan_id');
            $table->unsignedInteger('installment_number');
            $table->date('due_date');
            $table->decimal('expected_principal', 15, 2)->default(0);
            $table->decimal('expected_interest', 15, 2)->default(0);
            $table->enum('status', ['pending', 'paid', 'partial', 'overdue', 'waived'])->default('pending');
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->foreign('loan_id')->references('id')->on('loans');
            $table->unique(['loan_id', 'installment_number']);
        });

        Schema::create('loan_repayments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('loan_id');
            $table->unsignedBigInteger('transaction_id')->nullable();
            $table->unsignedBigInteger('schedule_installment_id')->nullable();
            $table->date('payment_date');
            $table->decimal('amount_paid', 15, 2);
            $table->decimal('principal_component', 15, 2)->default(0);
            $table->decimal('interest_component', 15, 2)->default(0);
            $table->decimal('balance_after', 15, 2)->default(0);
            $table->unsignedBigInteger('paid_from_account_id')->nullable();
            $table->string('payment_reference')->nullable();
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->foreign('loan_id')->references('id')->on('loans');
            $table->foreign('transaction_id')->references('id')->on('transactions');
            $table->foreign('schedule_installment_id')->references('id')->on('loan_schedules');
            $table->foreign('paid_from_account_id')->references('id')->on('accounts');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loan_repayments');
        Schema::dropIfExists('loan_schedules');
        Schema::dropIfExists('loans');
    }
};