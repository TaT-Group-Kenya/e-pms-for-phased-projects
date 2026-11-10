<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('loans', function ($table) {
            // Dual-value storage: USD columns keep the loan's operating
            // currency (schedule, repayments, allocations); the _kes columns
            // hold the booked KES equivalents used by the trial balance.
            $table->decimal('principal_kes', 15, 2)->default(0)->after('principal');
            $table->decimal('installment_amount_kes', 15, 2)->default(0)->after('installment_amount');
        });

        // Backfill: KES loans carry rate 1 (same value); non-KES loans get
        // their rate from the transaction where one was recorded.
        DB::table('loans')->update([
            'principal_kes' => DB::raw("CASE WHEN currency = 'KES' THEN principal ELSE 0 END"),
            'installment_amount_kes' => DB::raw("CASE WHEN currency = 'KES' THEN installment_amount ELSE 0 END"),
        ]);

        // Non-KES loans: adopt the recorded disbursement rate when usable,
        // otherwise leave 0 so the next TB run surfaces them for cleanup.
        DB::statement(
            'UPDATE loans
             JOIN transactions ON transactions.source_type = ? AND transactions.source_id = loans.id
             SET loans.principal_kes = ROUND(loans.principal * transactions.exchange_rate, 2),
                 loans.installment_amount_kes = ROUND(loans.installment_amount * transactions.exchange_rate, 2)
             WHERE loans.currency <> ? AND transactions.exchange_rate > 1',
            ['loan_disbursement', 'KES']
        );
    }

    public function down(): void
    {
        Schema::table('loans', function ($table) {
            $table->dropColumn(['principal_kes', 'installment_amount_kes']);
        });
    }
};
