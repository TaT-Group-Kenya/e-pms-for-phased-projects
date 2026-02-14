<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {

            $table->id();

            $table->string('order_number');

            $table->unsignedBigInteger('quotation_id');
            $table->unsignedBigInteger('project_id');
            $table->unsignedBigInteger('customer_id');

            $table->string('title');
            $table->text('description');

            $table->enum('status', ['draft','sent','approved','rejected','revised']);

            $table->decimal('subtotal_amount', 15, 2);
            $table->decimal('tax_percentage', 8, 2);
            $table->decimal('tax_amount', 15, 2);
            $table->decimal('discount_percentage', 8, 2);
            $table->decimal('discount_amount', 15, 2);
            $table->decimal('total_amount', 15, 2);

            $table->string('currency');

            $table->text('payment_terms');
            $table->text('notes_to_customer');

            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

            $table->timestamp('created_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};