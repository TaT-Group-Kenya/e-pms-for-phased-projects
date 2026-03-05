<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            if (Schema::hasColumn('projects', 'project_category_id')) {
                $table->unsignedBigInteger('project_category_id')->nullable()->change();
            }
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            if (Schema::hasColumn('projects', 'project_category_id')) {
                $table->unsignedBigInteger('project_category_id')->nullable(false)->change();
            }
        });
    }
};
