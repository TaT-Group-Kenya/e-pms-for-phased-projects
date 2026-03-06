<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Drop the foreign key only if the transaction_id column exists
        if (Schema::hasColumn('company_payments', 'transaction_id')) {
            Schema::table('company_payments', function (Blueprint $table) {
                // Drop only the foreign key constraint, keep the transaction_id column
                $table->dropForeign('company_payments_transaction_id_foreign');
            });
        }
    }

    public function down(): void
    {
        Schema::table('company_payments', function (Blueprint $table) {
            // Restore the foreign key constraint on transaction_id
            if (Schema::hasColumn('company_payments', 'transaction_id')) {
                $table->foreign('transaction_id', 'company_payments_transaction_id_foreign')
                    ->references('id')
                    ->on('transactions')
                    ->onDelete('cascade');
            }
        });
    }
};
