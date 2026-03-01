<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->unsignedBigInteger('project_source_origin_id')->nullable()->after('project_category_id');
            $table->unsignedBigInteger('project_location_id')->nullable()->after('project_source_origin_id');

            $table->foreign('project_source_origin_id')
                ->references('id')
                ->on('project_source_origin')
                ->onDelete('set null');

            $table->foreign('project_location_id')
                ->references('id')
                ->on('project_location')
                ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropForeign(['project_source_origin_id']);
            $table->dropForeign(['project_location_id']);
            $table->dropColumn(['project_source_origin_id', 'project_location_id']);
        });
    }
};
