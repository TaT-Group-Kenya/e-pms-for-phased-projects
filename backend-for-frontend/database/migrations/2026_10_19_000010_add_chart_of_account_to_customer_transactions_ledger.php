<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Transaction tagging by ChartOfAccounts: customer invoice payments
        // and debit note postings are revenue (chart 4000).
        Schema::table('customer_transactions_ledger', function ($table) {
            $table->unsignedBigInteger('chart_of_account')->default(0)->after('account_credit');
            $table->index('chart_of_account');
        });

        $revenueId = (int) DB::table('chart_of_accounts')->where('code', '4000')->value('id');

        DB::table('customer_transactions_ledger')->update(['chart_of_account' => $revenueId]);

        DB::statement(
            'ALTER TABLE customer_transactions_ledger ALTER COLUMN chart_of_account SET DEFAULT '.$revenueId
        );
    }

    public function down(): void
    {
        if (Schema::hasColumn('customer_transactions_ledger', 'chart_of_account')) {
            if (Schema::hasIndex('customer_transactions_ledger', 'customer_transactions_ledger_chart_of_account_index')) {
                Schema::table('customer_transactions_ledger', function ($table) {
                    $table->dropIndex(['chart_of_account']);
                });
            }

            Schema::table('customer_transactions_ledger', function ($table) {
                $table->dropColumn('chart_of_account');
            });
        }
    }
};
