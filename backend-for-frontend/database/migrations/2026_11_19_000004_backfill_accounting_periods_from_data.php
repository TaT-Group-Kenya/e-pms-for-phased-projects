<?php

namespace Database\Migrations;

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Backfills open accounting periods for every fiscal year already represented
 * in existing transaction data, so all history starts OPEN and only months
 * that the business deliberately closes become locked.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! \Schema::hasTable('accounting_periods')) {
            return;
        }

        $years = collect();

        $sources = ['transactions', 'quotations', 'orders', 'cust_invoices', 'company_invoices', 'office_expenses'];
        foreach ($sources as $table) {
            if (! \Schema::hasTable($table)) {
                continue;
            }
            $column = $table === 'office_expenses' ? 'date' : 'created_at';
            try {
                $years = $years->merge(
                    DB::table($table)
                        ->selectRaw("DISTINCT YEAR({$column}) as y")
                        ->whereNotNull($column)
                        ->pluck('y')
                );
            } catch (\Throwable) {
                // table not queryable in this environment; skip
            }
        }

        foreach ($years->filter()->unique()->sort()->values() as $year) {
            $this->backfillYear((int) $year);
        }
    }

    protected function backfillYear(int $year): void
    {
        if (DB::table('accounting_periods')->where('period_type', 'year')->where('fiscal_year', $year)->exists()) {
            return;
        }

        DB::table('accounting_periods')->insert([
            'period_type' => 'year',
            'fiscal_year' => $year,
            'name' => "FY {$year}",
            'start_date' => "{$year}-01-01",
            'end_date' => "{$year}-12-31",
            'status' => 'open',
            'created_at' => now(),
            'updated_at' => now(),
            'is_deleted' => false,
            'created_by' => 1,
            'updated_by' => 1,
        ]);

        foreach (range(1, 4) as $quarter) {
            DB::table('accounting_periods')->insert([
                'period_type' => 'quarter',
                'fiscal_year' => $year,
                'quarter' => $quarter,
                'name' => sprintf('Q%d %d', $quarter, $year),
                'start_date' => now()->setDate($year, ($quarter - 1) * 3 + 1, 1)->toDateString(),
                'end_date' => now()->setDate($year, $quarter * 3, 1)->endOfMonth()->toDateString(),
                'status' => 'open',
                'created_at' => now(),
                'updated_at' => now(),
                'is_deleted' => false,
                'created_by' => 1,
                'updated_by' => 1,
            ]);
        }

        foreach (range(1, 12) as $month) {
            DB::table('accounting_periods')->insert([
                'period_type' => 'month',
                'fiscal_year' => $year,
                'quarter' => intdiv($month - 1, 3) + 1,
                'month' => $month,
                'name' => now()->setDate($year, $month, 1)->format('M Y'),
                'start_date' => now()->setDate($year, $month, 1)->toDateString(),
                'end_date' => now()->setDate($year, $month, 1)->endOfMonth()->toDateString(),
                'status' => 'open',
                'created_at' => now(),
                'updated_at' => now(),
                'is_deleted' => false,
                'created_by' => 1,
                'updated_by' => 1,
            ]);
        }
    }

    public function down(): void
    {
        //
    }
};
