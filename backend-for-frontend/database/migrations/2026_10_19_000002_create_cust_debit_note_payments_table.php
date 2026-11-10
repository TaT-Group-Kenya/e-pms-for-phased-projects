<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Link payments to the debit notes they settle (mirrors cust_payment_allocations)
        Schema::create('cust_debit_note_payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('debit_note_id')->index();
            $table->unsignedBigInteger('payment_id')->index();
            $table->decimal('allocated_amount', 15, 2);
            $table->date('payment_date');
            $table->unsignedInteger('installment_number')->default(1);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->foreign('debit_note_id')->references('id')->on('cust_debit_notes')->onDelete('cascade');
            $table->foreign('payment_id')->references('id')->on('cust_payments')->onDelete('cascade');
        });

        // Debit notes gain invoice-like settlement statuses. The ledger already
        // allows 'invoice'/'receipt'/'refund'; statuses live on the note itself.
        DB::statement("ALTER TABLE cust_debit_notes MODIFY status ENUM('draft','raised','partial-paid','paid') NOT NULL DEFAULT 'draft'");
    }

    public function down(): void
    {
        Schema::dropIfExists('cust_debit_note_payments');

        DB::statement("ALTER TABLE cust_debit_notes MODIFY status VARCHAR(255) NOT NULL DEFAULT 'draft'");
    }
};