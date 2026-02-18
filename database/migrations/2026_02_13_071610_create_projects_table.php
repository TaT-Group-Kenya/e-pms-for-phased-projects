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

            $table->string('name');
            $table->text('description');

            $table->unsignedBigInteger('company_id');
            $table->unsignedBigInteger('customer_id');
            $table->unsignedBigInteger('project_category_id');

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
        Schema::dropIfExists('projects');
    }
};