<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_progress_updates', function (Blueprint $table) {

            $table->id();

            $table->unsignedBigInteger('project_id');

            $table->string('update_title');
            $table->text('update_description');

            $table->decimal('progress_percentage', 5, 2);

            $table->date('update_date');

            $table->string('attachment')->nullable();

            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

            $table->timestamp('created_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_progress_updates');
    }
};