<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quotation_tax_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('quotation_id');
            $table->unsignedBigInteger('tax_id')->nullable();
            $table->string('item_name');
            $table->enum('item_type', ['fixed', 'percent']);
            $table->decimal('item_value', 15, 2)->nullable();
            $table->decimal('item_amount', 15, 2)->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();

            $table->foreign('quotation_id')->references('id')->on('quotations')->onDelete('cascade');
            $table->foreign('tax_id')->references('id')->on('taxes');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quotation_tax_items');
    }
};
