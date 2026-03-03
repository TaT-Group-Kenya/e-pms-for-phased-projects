<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Change the ENUM values for transaction_type to ['topup', 'expense']
        DB::statement("ALTER TABLE transactions MODIFY transaction_type ENUM('topup','expense') NOT NULL");
    }

    public function down(): void
    {
        // Revert ENUM values back to the original set if needed
        DB::statement("ALTER TABLE transactions MODIFY transaction_type ENUM('payment','receipt','refund') NOT NULL");
    }
};
