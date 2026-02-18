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
            $table->unsignedBigInteger('project_id');
            $table->unsignedBigInteger('phase_id');
            $table->unsignedBigInteger('company_id');
            $table->boolean('is_complete');
            $table->timestamps();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            
            $table->unique(['project_id', 'phase_id', 'company_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_projects');
    }
};