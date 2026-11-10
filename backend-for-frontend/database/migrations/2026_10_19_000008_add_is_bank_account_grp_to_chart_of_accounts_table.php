<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::disableForeignKeyConstraints();

        // Remove current data, keep the same IDs on re-insert so the
        // accounts.chart_of_account_id foreign key stays consistent.
        DB::table('chart_of_accounts')->delete();

        // The column may already exist if this migration was partially
        // applied before.
        if (! Schema::hasColumn('chart_of_accounts', 'is_bank_account_grp')) {
            Schema::table('chart_of_accounts', function (Blueprint $table) {
                $table->boolean('is_bank_account_grp')->default(false);
            });
        }

        foreach ($this->standardChartOfAccounts() as $seed) {
            DB::table('chart_of_accounts')->insert($seed);
        }

        Schema::enableForeignKeyConstraints();
    }

    public function down(): void
    {
        if (Schema::hasColumn('chart_of_accounts', 'is_bank_account_grp')) {
            Schema::table('chart_of_accounts', function (Blueprint $table) {
                $table->dropColumn('is_bank_account_grp');
            });
        }

        DB::table('chart_of_accounts')->delete();

        foreach ($this->originalChartOfAccounts() as $seed) {
            DB::table('chart_of_accounts')->insert($seed);
        }
    }

    private function standardChartOfAccounts(): array
    {
        return [
            [
                'id' => 1, 'code' => '1000', 'name' => 'Assets',
                'description' => 'Assets', 'is_bank_account_grp' => true,
                'created_at' => now(), 'updated_at' => now(), 'is_deleted' => false,
            ],
            [
                'id' => 2, 'code' => '2000', 'name' => 'Liabilities',
                'description' => 'Liabilities', 'is_bank_account_grp' => true,
                'created_at' => now(), 'updated_at' => now(), 'is_deleted' => false,
            ],
            [
                'id' => 3, 'code' => '3000', 'name' => 'Equity',
                'description' => 'Equity', 'is_bank_account_grp' => false,
                'created_at' => now(), 'updated_at' => now(), 'is_deleted' => false,
            ],
            [
                'id' => 4, 'code' => '4000', 'name' => 'Revenue/Income',
                'description' => 'Revenue/Income', 'is_bank_account_grp' => false,
                'created_at' => now(), 'updated_at' => now(), 'is_deleted' => false,
            ],
            [
                'id' => 5, 'code' => '5000', 'name' => 'Expenses',
                'description' => 'Expenses', 'is_bank_account_grp' => false,
                'created_at' => now(), 'updated_at' => now(), 'is_deleted' => false,
            ],
        ];
    }

    private function originalChartOfAccounts(): array
    {
        return [
            ['id' => 1, 'code' => '1000', 'name' => 'Assets', 'description' => 'Assets'],
            ['id' => 2, 'code' => '2000', 'name' => 'Liabilities', 'description' => 'Liabilities'],
            ['id' => 3, 'code' => '3000', 'name' => 'Equity', 'description' => 'Equity'],
            ['id' => 4, 'code' => '4000', 'name' => 'Revenue/Income', 'description' => 'Revenue/Income'],
            ['id' => 5, 'code' => '5000', 'name' => 'Expenses', 'description' => 'Expenses'],
        ];
    }
};
