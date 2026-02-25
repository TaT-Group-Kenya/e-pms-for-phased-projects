<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('project_progress_updates', function (Blueprint $table) {
            $table->integer('percentage_complete')->change();
            $table->text('comment')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('project_progress_updates', function (Blueprint $table) {
            $table->string('percentage_complete')->change();
            $table->string('comment')->nullable()->change();
        });
    }
};
