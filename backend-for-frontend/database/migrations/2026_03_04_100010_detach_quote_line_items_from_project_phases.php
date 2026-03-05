<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        Schema::table('quote_line_items', function (Blueprint $table) {
            if (Schema::hasColumn('quote_line_items', 'project_phase_id')) {
                // Drop foreign key first if it exists
                try {
                    $table->dropForeign(['project_phase_id']);
                } catch (\Throwable $e) {
                    // Ignore if FK does not exist
                }

                $table->dropColumn('project_phase_id');
            }
        });
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }

    public function down(): void
    {
        Schema::table('quote_line_items', function (Blueprint $table) {
            if (! Schema::hasColumn('quote_line_items', 'project_phase_id')) {
                $table->unsignedBigInteger('project_phase_id')->nullable();

                try {
                    $table->foreign('project_phase_id')
                        ->references('id')
                        ->on('project_phases')
                        ->onDelete('cascade');
                } catch (\Throwable $e) {
                    // Ignore if FK cannot be created
                }
            }
        });
    }
};
