<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_credit_note_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('credit_note_id');
            $table->string('item_name');
            $table->text('item_description')->nullable();
            $table->decimal('item_amount', 15, 2);
            $table->text('custom_note')->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();

            $table->foreign('credit_note_id')->references('id')->on('company_credit_notes')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_credit_note_items');
    }
};
