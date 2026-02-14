<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quote_line_items', function (Blueprint $table) {

            $table->id();

            $table->unsignedBigInteger('quotation_id');
            $table->unsignedBigInteger('project_phase_id');

            $table->string('phase_name');
            $table->text('phase_description');

            $table->decimal('quoted_amount', 15, 2);
            $table->integer('estimated_hours')->nullable();

            $table->text('custom_note')->nullable();

            $table->boolean('is_taxable');

            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

            $table->timestamp('created_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quote_line_items');
    }
};