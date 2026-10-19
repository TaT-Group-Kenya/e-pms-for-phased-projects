<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // A single repayment can settle several schedule installments (early
        // settlement or payments larger than one installment). This table
        // records how much of each repayment went to which installment.
        Schema::create('loan_repayment_allocations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('loan_id');
            $table->unsignedBigInteger('repayment_id');
            $table->unsignedBigInteger('schedule_installment_id');
            $table->decimal('interest_applied', 15, 2)->default(0);
            $table->decimal('principal_applied', 15, 2)->default(0);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->foreign('loan_id')->references('id')->on('loans');
            $table->foreign('repayment_id')->references('id')->on('loan_repayments');
            $table->foreign('schedule_installment_id')->references('id')->on('loan_schedules');
            $table->index(['repayment_id', 'schedule_installment_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loan_repayment_allocations');
    }
};