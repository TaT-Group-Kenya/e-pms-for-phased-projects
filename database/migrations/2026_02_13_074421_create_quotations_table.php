<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quotations', function (Blueprint $table) {
            $table->id();
            $table->string('quotation_number');
            $table->unsignedBigInteger('project_id');
            $table->unsignedBigInteger('customer_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('status', ['draft','sent','approved','rejected','revised'])->default('draft');
            $table->date('valid_until_date');
            $table->decimal('subtotal_amount', 15, 2);
            $table->decimal('tax_percentage', 8, 2);
            $table->decimal('tax_amount', 15, 2);
            $table->decimal('discount_percentage', 8, 2);
            $table->decimal('discount_amount', 15, 2);
            $table->decimal('total_amount', 15, 2);
            $table->string('currency');
            $table->text('payment_terms')->nullable();
            $table->integer('min_approval_count')->default(1);
            $table->text('notes_to_customer')->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quotations');
    }
};