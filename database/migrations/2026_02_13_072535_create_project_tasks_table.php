<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_tasks', function (Blueprint $table) {

            $table->id();

            $table->unsignedBigInteger('project_id');
            $table->unsignedBigInteger('project_phase_id');

            $table->string('name');
            $table->text('description');

            $table->date('start_date');
            $table->date('end_date');

            $table->string('status');
            $table->decimal('budget', 15, 2);

            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

            $table->timestamp('created_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_tasks');
    }
};