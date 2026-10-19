<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('projects', 'container_numbers')) {
            Schema::table('projects', function (Blueprint $table) {
                $table->dropColumn('container_numbers');
            });
        }

        $phaseColumns = array_values(array_filter(
            ['container_numbers', 'entry_number'],
            fn (string $column) => Schema::hasColumn('project_phases', $column)
        ));

        if ($phaseColumns !== []) {
            Schema::table('project_phases', function (Blueprint $table) use ($phaseColumns) {
                $table->dropColumn($phaseColumns);
            });
        }
    }

    public function down(): void
    {
        if (! Schema::hasColumn('projects', 'container_numbers')) {
            Schema::table('projects', function (Blueprint $table) {
                $table->string('container_numbers')->nullable();
            });
        }

        if (! Schema::hasColumn('project_phases', 'container_numbers')) {
            Schema::table('project_phases', function (Blueprint $table) {
                $table->text('container_numbers')->nullable();
            });
        }

        if (! Schema::hasColumn('project_phases', 'entry_number')) {
            Schema::table('project_phases', function (Blueprint $table) {
                $table->text('entry_number')->nullable();
            });
        }
    }
};
