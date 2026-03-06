<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
{
    try {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        Schema::table('quotations', function (Blueprint $table) {
            // Drop foreign key first (use the actual constraint name)
            $table->dropForeign(['project_id']); // or 'quotations_project_id_foreign'
            
            // Then drop the unique index
            $table->dropUnique('quotations_project_id_unique');
            
            // Finally drop the column
            $table->dropColumn('project_id');
        });
    } finally {
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}

    public function down(): void
    {
        try {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
            
            Schema::table('quotations', function (Blueprint $table) {
                if (!Schema::hasColumn('quotations', 'project_id')) {
                    $table->unsignedBigInteger('project_id')->nullable();
                }

                // Check if the index already exists before creating it
                $indexExists = $this->indexExists('quotations', 'quotations_project_id_unique');
                
                if (!$indexExists && Schema::hasColumn('quotations', 'project_id')) {
                    $table->unique('project_id', 'quotations_project_id_unique');
                }
            });
        } finally {
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        }
    }

    /**
     * Check if an index exists on a table
     */
    private function indexExists(string $table, string $indexName): bool
    {
        $schemaName = DB::connection()->getDatabaseName();
        
        $index = DB::selectOne("
            SELECT INDEX_NAME 
            FROM INFORMATION_SCHEMA.STATISTICS 
            WHERE TABLE_SCHEMA = ? 
            AND TABLE_NAME = ? 
            AND INDEX_NAME = ?
        ", [$schemaName, $table, $indexName]);
        
        return !is_null($index);
    }
};