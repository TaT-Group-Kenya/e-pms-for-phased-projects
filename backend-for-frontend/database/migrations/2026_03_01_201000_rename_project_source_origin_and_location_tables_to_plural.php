<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Rename tables to pluralized forms
        if (Schema::hasTable('project_source_origin') && !Schema::hasTable('project_source_origins')) {
            Schema::rename('project_source_origin', 'project_source_origins');
        }

        if (Schema::hasTable('project_location') && !Schema::hasTable('project_locations')) {
            Schema::rename('project_location', 'project_locations');
        }
    }

    public function down(): void
    {
        // Revert table names back to singular
        if (Schema::hasTable('project_source_origins') && !Schema::hasTable('project_source_origin')) {
            Schema::rename('project_source_origins', 'project_source_origin');
        }

        if (Schema::hasTable('project_locations') && !Schema::hasTable('project_location')) {
            Schema::rename('project_locations', 'project_location');
        }
    }
};
