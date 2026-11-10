<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // The Loan entity itself is the liability; the borrowed money is
        // disbursed straight onto the destination asset account. Adopt the
        // destination_account_id column that already exists in deployed
        // databases (its migration file was never committed) and drop the
        // legacy account_id column.
        $accountCol = Schema::hasColumn('loans', 'account_id');
        $destinationCol = Schema::hasColumn('loans', 'destination_account_id');

        if ($accountCol && $destinationCol) {
            DB::table('loans')
                ->whereNull('destination_account_id')
                ->whereNotNull('account_id')
                ->update(['destination_account_id' => DB::raw('account_id')]);

            Schema::table('loans', function ($table) {
                $table->dropForeign(['account_id']);
                $table->dropColumn('account_id');
            });
        } elseif ($accountCol) {
            Schema::table('loans', function ($table) {
                $table->dropForeign(['account_id']);
                $table->renameColumn('account_id', 'destination_account_id');
            });

            Schema::table('loans', function ($table) {
                $table->foreign('destination_account_id')->references('id')->on('accounts');
            });
        }

        Schema::table('loans', function ($table) {
            // Every loan is a liability position on the books; defaults to
            // the Liabilities chart (code 2000), whose id is resolved below
            // for the column default.
            $table->unsignedBigInteger('chart_of_account_id')->default(0)->after('currency');
            $table->index('chart_of_account_id');
        });

        $liabilitiesId = (int) DB::table('chart_of_accounts')->where('code', '2000')->value('id');

        DB::table('loans')->update(['chart_of_account_id' => $liabilitiesId]);

        DB::statement(
            'ALTER TABLE loans ALTER COLUMN chart_of_account_id SET DEFAULT '.$liabilitiesId
        );
    }

    public function down(): void
    {
        if (Schema::hasColumn('loans', 'chart_of_account_id')) {
            if (Schema::hasIndex('loans', 'loans_chart_of_account_id_index')) {
                Schema::table('loans', function ($table) {
                    $table->dropIndex(['chart_of_account_id']);
                });
            }

            Schema::table('loans', function ($table) {
                $table->dropColumn('chart_of_account_id');
            });
        }

        if (Schema::hasColumn('loans', 'destination_account_id')
            && ! Schema::hasColumn('loans', 'account_id')) {
            Schema::table('loans', function ($table) {
                $table->unsignedBigInteger('account_id')->after('id');
            });

            DB::table('loans')
                ->whereNotNull('destination_account_id')
                ->update(['account_id' => DB::raw('destination_account_id')]);

            Schema::table('loans', function ($table) {
                $table->foreign('account_id')->references('id')->on('accounts');
            });
        }
    }
};
