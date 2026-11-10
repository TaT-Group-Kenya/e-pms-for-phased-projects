<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tag name mirrors the customer_transactions_ledger: the chart of
        // accounts code the loan falls under (default: Liabilities 2000).
        Schema::table('loans', function ($table) {
            if (Schema::hasIndex('loans', 'loans_chart_of_account_id_index')) {
                $table->dropIndex('loans_chart_of_account_id_index');
            }
        });

        Schema::table('loans', function ($table) {
            $table->renameColumn('chart_of_account_id', 'chart_of_account');
        });

        Schema::table('loans', function ($table) {
            $table->index('chart_of_account');
        });
    }

    public function down(): void
    {
        Schema::table('loans', function ($table) {
            if (Schema::hasIndex('loans', 'loans_chart_of_account_index')) {
                $table->dropIndex('loans_chart_of_account_index');
            }
        });

        Schema::table('loans', function ($table) {
            $table->renameColumn('chart_of_account', 'chart_of_account_id');
        });

        Schema::table('loans', function ($table) {
            $table->index('chart_of_account_id');
        });
    }
};
