<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chart_of_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });

        // Seed the standard top-level chart of accounts.
        foreach ($this->standardChartOfAccounts() as $seed) {
            DB::table('chart_of_accounts')->updateOrInsert(
                ['code' => $seed['code']],
                array_merge($seed, [
                    'created_at' => now(),
                    'updated_at' => now(),
                    'is_deleted' => false,
                ])
            );
        }

        // Link accounts to a chart of account. An account can only be
        // linked to one chart of account.
        Schema::table('accounts', function (Blueprint $table) {
            $table->unsignedBigInteger('chart_of_account_id')->nullable()->after('currency');
            $table->foreign('chart_of_account_id')
                ->references('id')
                ->on('chart_of_accounts');
        });

        // Backfill existing accounts using the traditional classification
        // for cash/mpesa/bank accounts.
        $accountsTable = (new \App\Models\Account)->getTable();
        $liabilitiesId = DB::table('chart_of_accounts')->where('code', '2000')->value('id');
        $expensesId = DB::table('chart_of_accounts')->where('code', '5000')->value('id');

        foreach (DB::table($accountsTable)->whereNull('chart_of_account_id')->get(['id', 'type', 'group']) as $account) {
            $chartOfAccountId = ($account->type === 'bank' && $account->group === 'Petty')
                ? $expensesId
                : $liabilitiesId;

            DB::table($accountsTable)
                ->where('id', $account->id)
                ->update(['chart_of_account_id' => $chartOfAccountId]);
        }
    }

    public function down(): void
    {
        Schema::table('accounts', function (Blueprint $table) {
            if (Schema::hasColumn('accounts', 'chart_of_account_id')) {
                $table->dropForeign(['chart_of_account_id']);
                $table->dropColumn('chart_of_account_id');
            }
        });

        Schema::dropIfExists('chart_of_accounts');
    }

    private function standardChartOfAccounts(): array
    {
        return [
            ['code' => '1000', 'name' => 'Assets', 'description' => 'Assets'],
            ['code' => '2000', 'name' => 'Liabilities', 'description' => 'Liabilities'],
            ['code' => '3000', 'name' => 'Equity', 'description' => 'Equity'],
            ['code' => '4000', 'name' => 'Revenue/Income', 'description' => 'Revenue/Income'],
            ['code' => '5000', 'name' => 'Expenses', 'description' => 'Expenses'],
        ];
    }
};