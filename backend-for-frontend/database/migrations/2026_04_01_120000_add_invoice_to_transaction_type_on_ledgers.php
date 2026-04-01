<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Allow 'invoice' as a transaction_type for customer and company ledgers
        DB::statement("ALTER TABLE customer_transactions_ledger MODIFY transaction_type ENUM('payment','receipt','refund','invoice') NOT NULL");
        DB::statement("ALTER TABLE company_transactions_ledger MODIFY transaction_type ENUM('payment','receipt','refund','invoice') NOT NULL");
    }

    public function down(): void
    {
        // Revert back to the original ENUM values if needed
        DB::statement("ALTER TABLE customer_transactions_ledger MODIFY transaction_type ENUM('payment','receipt','refund') NOT NULL");
        DB::statement("ALTER TABLE company_transactions_ledger MODIFY transaction_type ENUM('payment','receipt','refund') NOT NULL");
    }
};
