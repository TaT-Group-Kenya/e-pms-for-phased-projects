<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('project_owners', function (Blueprint $table) {
            // Add the new name column
            $table->string('name')->after('id');
        });

        // Copy data from first_name + last_name to name
        DB::statement("UPDATE project_owners SET name = CONCAT(COALESCE(first_name, ''), ' ', COALESCE(last_name, ''))");

        Schema::table('project_owners', function (Blueprint $table) {
            // Drop the old columns
            $table->dropColumn('first_name');
            $table->dropColumn('last_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('project_owners', function (Blueprint $table) {
            $table->string('first_name')->after('id');
            $table->string('last_name')->after('first_name');
        });

        // Try to split name back (best effort)
        DB::statement("UPDATE project_owners SET first_name = SUBSTRING_INDEX(name, ' ', 1), last_name = SUBSTRING_INDEX(name, ' ', -1)");

        Schema::table('project_owners', function (Blueprint $table) {
            $table->dropColumn('name');
        });
    }
};
