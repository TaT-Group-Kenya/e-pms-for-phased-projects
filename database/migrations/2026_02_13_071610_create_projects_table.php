<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {

            $table->id();
            $table->timestamps();

            $table->string('code');
            $table->string('name');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('company_id')->nullable();
            $table->unsignedBigInteger('customer_id');
            $table->unsignedBigInteger('project_category_id');
            $table->string('no_of_phases');
            $table->decimal('budget_estimate', 15, 2)->nullable();
            $table->string('status');
            $table->string('priority')->nullable();
            $table->string('progress')->nullable();
            $table->string('tags')->nullable();
            $table->string('currency');
            $table->date('start_date');
            $table->date('end_date');

            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};