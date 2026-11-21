<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tax bills: monthly VAT runs. Each bill snapshots the month's ledger
     * positions at run time (output VAT, recoverable input VAT and the
     * resulting liability) and tracks a single-installment settlement.
     *
     *  - status pending_payment: run and outstanding.
     *  - status paid: settled through payFromAccount (payments log the
     *    offsetting transaction + tax ledger entry).
     *
     * One bill per period month, enforced by a unique index.
     */
    public function up(): void
    {
        Schema::create('tax_bills', function (Blueprint $table) {
            $table->id();
            $table->string('bill_number')->unique();
            // The VAT period this bill covers (1-12, calendar year).
            $table->unsignedTinyInteger('period_month');
            $table->unsignedSmallInteger('period_year');
            // Snapshot of the ledger at run time (KES).
            $table->decimal('vat_out', 15, 2)->default(0);
            $table->decimal('vat_in', 15, 2)->default(0);
            $table->decimal('vat_liability', 15, 2)->default(0);
            $table->decimal('amount', 15, 2)->default(0);
            $table->decimal('paid_amount', 15, 2)->default(0);
            $table->decimal('balance', 15, 2)->default(0);
            $table->enum('status', ['pending_payment', 'paid'])->default('pending_payment');
            $table->date('run_date')->nullable();
            $table->date('paid_date')->nullable();
            $table->unsignedBigInteger('payment_id')->nullable();
            $table->unsignedBigInteger('transaction_id')->nullable();
            $table->unsignedBigInteger('tax_ledger_entry_id')->nullable();
            $table->string('paid_from_account')->nullable();
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->unique(['period_year', 'period_month'], 'tax_bills_period_unique');
            $table->index(['status'], 'tax_bills_status_index');
        });

        // The bill is the source of the payment flows; the transactions
        // ledger points back at the bill via source_type/source_id.
        Schema::table('tax_transactions', function (Blueprint $table) {
            $table->index('source_type', 'tax_txn_source_type_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tax_bills');

        if (Schema::hasTable('tax_transactions') && Schema::hasIndex('tax_transactions', 'tax_txn_source_type_index')) {
            Schema::table('tax_transactions', function (Blueprint $table) {
                $table->dropIndex('tax_txn_source_type_index');
            });
        }
    }
};
