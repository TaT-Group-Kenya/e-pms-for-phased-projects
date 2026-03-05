<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            if (Schema::hasColumn('order_items', 'project_phase_id')) {
                try {
                    $table->dropForeign(['project_phase_id']);
                } catch (\Throwable $e) {
                    // Ignore if FK does not exist
                }

                $table->dropColumn('project_phase_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            if (! Schema::hasColumn('order_items', 'project_phase_id')) {
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
