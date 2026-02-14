<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_invoices', function (Blueprint $table) {

            $table->id();

            $table->string('invoice_number');

            $table->unsignedBigInteger('project_id');

            $table->date('invoice_date');
            $table->date('due_date');

            $table->decimal('subtotal_amount', 15, 2);
            $table->decimal('tax_amount', 15, 2);
            $table->decimal('total_amount', 15, 2);

            $table->string('currency');
            $table->decimal('exchange_rate', 15, 6);

            $table->enum('invoice_status', ['draft','sent','paid','overdue','cancelled']);

            $table->text('notes')->nullable();

            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

            $table->timestamp('created_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_invoices');
    }
};