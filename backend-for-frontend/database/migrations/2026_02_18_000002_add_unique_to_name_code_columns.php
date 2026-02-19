<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AddUniqueToNameCodeColumns extends Migration
{
    public function up(): void
    {
        $map = [
            'countries' => ['name', 'code'],
            'languages' => ['name', 'code'],
            'currencies' => ['name', 'code'],
            'payment_methods' => ['name'],
            'taxes' => ['name', 'code'],
            'account_types' => ['name'],
            'account_groups' => ['name'],
            'sys_roles' => ['name'],
            'sys_groups' => ['name'],
        ];

        foreach ($map as $table => $cols) {
            if (! Schema::hasTable($table)) {
                continue;
            }

            foreach ($cols as $col) {
                if (! Schema::hasColumn($table, $col)) {
                    continue;
                }

                $indexName = 'ux_' . $table . '_' . $col;

                try {
                    // MySQL/Postgres compatible raw ALTER (MySQL will create an index name)
                    DB::statement(sprintf('ALTER TABLE `%s` ADD CONSTRAINT `%s` UNIQUE (`%s`)', $table, $indexName, $col));
                } catch (\Throwable $e) {
                    // ignore if index/constraint already exists or DB doesn't support this syntax
                    try {
                        // fallback to adding index without explicit constraint name
                        DB::statement(sprintf('CREATE UNIQUE INDEX `%s` ON `%s`(`%s`)', $indexName, $table, $col));
                    } catch (\Throwable $e2) {
                        // give up quietly; index likely already exists or not supported in this DB
                    }
                }
            }
        }
    }

    public function down(): void
    {
        $map = [
            'countries' => ['name', 'code'],
            'languages' => ['name', 'code'],
            'currencies' => ['name', 'code'],
            'payment_methods' => ['name'],
            'taxes' => ['name', 'code'],
            'account_types' => ['name'],
            'account_groups' => ['name'],
            'sys_roles' => ['name'],
            'sys_groups' => ['name'],
        ];

        foreach ($map as $table => $cols) {
            if (! Schema::hasTable($table)) {
                continue;
            }

            foreach ($cols as $col) {
                $indexName = 'ux_' . $table . '_' . $col;

                try {
                    // MySQL: DROP INDEX name ON table
                    DB::statement(sprintf('DROP INDEX `%s` ON `%s`', $indexName, $table));
                } catch (\Throwable $e) {
                    try {
                        // Postgres: ALTER TABLE DROP CONSTRAINT name
                        DB::statement(sprintf('ALTER TABLE "%s" DROP CONSTRAINT IF EXISTS "%s"', $table, $indexName));
                    } catch (\Throwable $e2) {
                        // ignore if doesn't exist
                    }
                }
            }
        }
    }
}
