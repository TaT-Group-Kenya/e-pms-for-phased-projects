<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Repayments record both the real (loan currency) and converted
        // (KES, at the loan's forex rate) components.
        Schema::table('loan_repayments', function ($table) {
            $table->decimal('amount_paid_kes', 15, 2)->default(0)->after('amount_paid');
            $table->decimal('principal_component_kes', 15, 2)->default(0)->after('principal_component');
            $table->decimal('interest_component_kes', 15, 2)->default(0)->after('interest_component');
            $table->decimal('exchange_rate', 15, 6)->default(1)->after('interest_component_kes');
        });

        Schema::table('loan_repayment_allocations', function ($table) {
            $table->decimal('interest_applied_kes', 15, 2)->default(0)->after('interest_applied');
            $table->decimal('principal_applied_kes', 15, 2)->default(0)->after('principal_applied');
        });

        // Backfill existing repayments from their loan's rate (KES loans: 1).
        DB::statement(
            'UPDATE loan_repayments r
             JOIN loans l ON l.id = r.loan_id
             SET r.exchange_rate = CASE WHEN l.currency = ? THEN 1
                    ELSE CASE WHEN l.principal > 0 THEN l.principal_kes / l.principal ELSE 0 END END,
                r.amount_paid_kes = ROUND(r.amount_paid * CASE WHEN l.currency = ? THEN 1
                    ELSE CASE WHEN l.principal > 0 THEN l.principal_kes / l.principal ELSE 0 END END, 2),
                r.principal_component_kes = ROUND(r.principal_component * CASE WHEN l.currency = ? THEN 1
                    ELSE CASE WHEN l.principal > 0 THEN l.principal_kes / l.principal ELSE 0 END END, 2),
                r.interest_component_kes = ROUND(r.interest_component * CASE WHEN l.currency = ? THEN 1
                    ELSE CASE WHEN l.principal > 0 THEN l.principal_kes / l.principal ELSE 0 END END, 2)',
            ['KES', 'KES', 'KES', 'KES']
        );

        DB::statement(
            'UPDATE loan_repayment_allocations a
             JOIN loan_repayments r ON r.id = a.repayment_id
             SET a.interest_applied_kes = ROUND(a.interest_applied * r.exchange_rate, 2),
                a.principal_applied_kes = ROUND(a.principal_applied * r.exchange_rate, 2)'
        );
    }

    public function down(): void
    {
        Schema::table('loan_repayment_allocations', function ($table) {
            $table->dropColumn(['interest_applied_kes', 'principal_applied_kes']);
        });

        Schema::table('loan_repayments', function ($table) {
            $table->dropColumn([
                'amount_paid_kes',
                'principal_component_kes',
                'interest_component_kes',
                'exchange_rate',
            ]);
        });
    }
};
