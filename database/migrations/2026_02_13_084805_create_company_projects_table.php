<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_projects', function (Blueprint $table) {

            $table->id();

            $table->string('project_name');
            $table->string('project_code');
            $table->text('project_description');

            $table->date('start_date');
            $table->date('end_date');

            $table->decimal('budget_amount', 15, 2);

            $table->enum('project_status', ['pending','ongoing','completed','cancelled']);

            $table->unsignedBigInteger('company_id');
            $table->unsignedBigInteger('manager_id');

            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

            $table->timestamp('created_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_projects');
    }
};