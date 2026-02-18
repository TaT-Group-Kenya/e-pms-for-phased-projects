<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quote_documents', function (Blueprint $table) {

            $table->id();
            $table->unsignedBigInteger('quotation_id');
            $table->string('document_path');
            $table->enum('document_type', ['proposal','terms','attachments']);
            $table->timestamps();
            $table->string('attachments')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quote_documents');
    }
};