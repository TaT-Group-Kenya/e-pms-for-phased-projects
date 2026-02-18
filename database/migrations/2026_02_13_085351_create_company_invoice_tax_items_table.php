<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_invoice_tax_items', function (Blueprint $table) {

            $table->id();
            $table->unsignedBigInteger('invoice_id');
            $table->string('item_name');
            $table->enum('item_type', ['fixed','percent']);
            $table->decimal('item_value', 15, 2);
            $table->timestamps();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();

            $table->foreign('invoice_id')->references('id')->on('company_invoices')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_invoice_tax_items');
    }
};