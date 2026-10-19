<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // The auto-composed index name is 69 chars, which older MySQL
        // builds reject (64-char identifier limit). Rename it to a
        // short explicit name.
        if (Schema::hasTable('loan_repayment_allocations')
            && $this->indexExists('loan_repayment_allocations', 'loan_repayment_allocations_repayment_id_schedule_installment_id_index')) {
            Schema::table('loan_repayment_allocations', function ($table) {
                $table->renameIndex(
                    'loan_repayment_allocations_repayment_id_schedule_installment_id_index',
                    'lra_repayment_installment_index'
                );
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('loan_repayment_allocations')
            && $this->indexExists('loan_repayment_allocations', 'lra_repayment_installment_index')) {
            Schema::table('loan_repayment_allocations', function ($table) {
                $table->renameIndex(
                    'lra_repayment_installment_index',
                    'loan_repayment_allocations_repayment_id_schedule_installment_id_index'
                );
            });
        }
    }

    private function indexExists(string $table, string $index): bool
    {
        $conn = Schema::getConnection();
        $driver = $conn->getDriverName();

        if ($driver === 'mysql' || $driver === 'mariadb') {
            $result = $conn->selectOne(
                'SELECT COUNT(*) AS c FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = ? AND index_name = ?',
                [$table, $index]
            );

            return ((int) $result->c) > 0;
        }

        if ($driver === 'sqlite') {
            $result = $conn->selectOne(
                "SELECT COUNT(*) AS c FROM sqlite_master WHERE type = 'index' AND name = ?",
                [$index]
            );

            return ((int) $result->c) > 0;
        }

        return false;
    }
};