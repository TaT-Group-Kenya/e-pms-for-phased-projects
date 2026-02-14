<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cust_invoice_tax_items', function (Blueprint $table) {

            $table->id();

            $table->unsignedBigInteger('invoice_id');

            $table->string('item_name');

            $table->enum('item_type', ['fixed','percent']);

            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

            $table->timestamp('created_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cust_invoice_tax_items');
    }
};