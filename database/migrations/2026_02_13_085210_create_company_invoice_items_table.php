<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_invoice_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('invoice_id');
            $table->unsignedBigInteger('project_phase_id');
            $table->string('item_name');
            $table->text('item_description')->nullable();
            $table->decimal('item_amount', 15, 2);
            $table->boolean('is_taxable');
            $table->timestamps();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();

            $table->foreign('invoice_id')->references('id')->on('company_invoices')->onDelete('cascade');
            $table->foreign('project_phase_id')->references('id')->on('project_phases')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_invoice_items');
    }
};