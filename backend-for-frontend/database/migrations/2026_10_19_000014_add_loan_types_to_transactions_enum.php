<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Widen the transaction_type enum: loan repayments post with
        // 'interest' (expense 5000) or 'loan_principal' (liability 2000)
        // legs, which should not be folded into the generic 'expense'.
        DB::statement(
            "ALTER TABLE transactions MODIFY transaction_type ENUM('topup','expense','interest','loan_principal') NOT NULL"
        );

        // Retag the loan repayment legs already recorded as 'expense'.
        DB::table('transactions')
            ->where('source_type', 'loan_repayment')
            ->where('transaction_type', 'expense')
            ->update(['transaction_type' => 'loan_principal']);
    }

    public function down(): void
    {
        // Fold the loan legs back into 'expense' before shrinking the enum.
        DB::table('transactions')
            ->where('transaction_type', 'loan_principal')
            ->update(['transaction_type' => 'expense']);

        DB::table('transactions')
            ->where('transaction_type', 'interest')
            ->update(['transaction_type' => 'expense']);

        DB::statement(
            "ALTER TABLE transactions MODIFY transaction_type ENUM('topup','expense') NOT NULL"
        );
    }
};
