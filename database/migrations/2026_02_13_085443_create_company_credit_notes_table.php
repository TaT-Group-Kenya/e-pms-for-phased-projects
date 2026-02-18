<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_credit_notes', function (Blueprint $table) {

            $table->id();

            $table->string('credit_note_number');

            $table->unsignedBigInteger('invoice_id');

            $table->date('credit_note_date');

            $table->text('reason');

            $table->decimal('subtotal_amount', 15, 2);
            $table->decimal('tax_amount', 15, 2);
            $table->decimal('total_amount', 15, 2);

            $table->string('currency');
            $table->decimal('exchange_rate', 15, 6);

            $table->enum('status', ['draft','issued','applied','cancelled']);

            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

            $table->timestamp('created_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_credit_notes');
    }
};