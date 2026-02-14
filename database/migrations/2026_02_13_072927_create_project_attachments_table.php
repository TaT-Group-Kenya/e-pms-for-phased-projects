<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_attachments', function (Blueprint $table) {

            $table->id();

            $table->unsignedBigInteger('project_id');
            $table->unsignedBigInteger('project_phase_id');
            $table->unsignedBigInteger('project_task_id');

            $table->string('file_name');
            $table->string('file_path');

            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

            $table->timestamp('created_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_attachments');
    }
};