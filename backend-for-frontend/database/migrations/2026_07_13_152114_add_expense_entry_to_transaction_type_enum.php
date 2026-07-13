<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update company_transactions_ledger transaction_type enum to include existing 'invoice' value plus new 'expense_entry'
        DB::statement("ALTER TABLE company_transactions_ledger MODIFY COLUMN transaction_type ENUM('invoice', 'payment', 'receipt', 'refund', 'expense_entry')");

        // Update customer_transactions_ledger transaction_type enum to include existing 'invoice' value plus new 'expense_entry'
        DB::statement("ALTER TABLE customer_transactions_ledger MODIFY COLUMN transaction_type ENUM('invoice', 'payment', 'receipt', 'refund', 'expense_entry')");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert company_transactions_ledger transaction_type enum to original values
        DB::statement("ALTER TABLE company_transactions_ledger MODIFY COLUMN transaction_type ENUM('payment', 'receipt', 'refund')");

        // Revert customer_transactions_ledger transaction_type enum to original values
        DB::statement("ALTER TABLE customer_transactions_ledger MODIFY COLUMN transaction_type ENUM('payment', 'receipt', 'refund')");
    }
};
