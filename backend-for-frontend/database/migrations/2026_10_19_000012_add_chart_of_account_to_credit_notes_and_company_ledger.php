<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Customer credit notes settle as a liability until refunded.
        Schema::table('cust_credit_notes', function ($table) {
            $table->unsignedBigInteger('chart_of_account')->default(0)->after('currency');
        });

        $liabilitiesId = (int) DB::table('chart_of_accounts')->where('code', '2000')->value('id');

        DB::table('cust_credit_notes')->update(['chart_of_account' => $liabilitiesId]);

        DB::statement(
            'ALTER TABLE cust_credit_notes ALTER COLUMN chart_of_account SET DEFAULT '.$liabilitiesId
        );

        // Company ledger tagging (mirrors the customer ledger): company
        // invoices (and their payments) are liabilities; company credit note
        // refunds are revenue.
        Schema::table('company_transactions_ledger', function ($table) {
            $table->unsignedBigInteger('chart_of_account')->default(0)->after('account_credit');
            $table->index('chart_of_account');
        });

        DB::table('company_transactions_ledger')->update(['chart_of_account' => $liabilitiesId]);

        DB::statement(
            'ALTER TABLE company_transactions_ledger ALTER COLUMN chart_of_account SET DEFAULT '.$liabilitiesId
        );
    }

    public function down(): void
    {
        if (Schema::hasColumn('cust_credit_notes', 'chart_of_account')) {
            Schema::table('cust_credit_notes', function ($table) {
                $table->dropColumn('chart_of_account');
            });
        }

        if (Schema::hasColumn('company_transactions_ledger', 'chart_of_account')) {
            Schema::table('company_transactions_ledger', function ($table) {
                if (Schema::hasIndex('company_transactions_ledger', 'company_transactions_ledger_chart_of_account_index')) {
                    $table->dropIndex(['chart_of_account']);
                }

                $table->dropColumn('chart_of_account');
            });
        }
    }
};
