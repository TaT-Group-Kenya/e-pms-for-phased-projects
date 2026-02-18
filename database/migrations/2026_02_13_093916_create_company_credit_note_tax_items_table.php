<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_credit_note_tax_items', function (Blueprint $table) {

            $table->id();

            $table->unsignedBigInteger('credit_note_id');

            $table->string('item_name');

            $table->enum('item_type', ['fixed','percent']);

            $table->decimal('item_value', 15, 2);

            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

            $table->timestamp('created_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_credit_note_tax_items');
    }
};