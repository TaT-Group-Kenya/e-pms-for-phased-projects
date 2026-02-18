<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cust_payment_allocations', function (Blueprint $table) {

            $table->id();
            $table->unsignedBigInteger('payment_id');
            $table->unsignedBigInteger('invoice_id');
            $table->decimal('allocated_amount', 15, 2);
            $table->date('allocation_date');
            $table->decimal('balance_before_payment', 15, 2);
            $table->decimal('balance_after_payment', 15, 2);
            $table->integer('installment_number');
            $table->timestamps();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cust_payment_allocations');
    }
};