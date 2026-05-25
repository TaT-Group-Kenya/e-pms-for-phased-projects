<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pdc_issued_companies', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_number')->nullable();
            $table->unsignedBigInteger('company_id')->nullable();
            $table->unsignedBigInteger('invoice_id')->nullable();
            $table->string('cheque_number')->nullable();
            $table->date('cheque_date')->nullable();
            $table->date('issued_date')->nullable();
            $table->decimal('amount', 18, 2)->default(0);
            $table->string('currency')->nullable();
            $table->string('bank')->nullable();
            $table->string('bank_branch')->nullable();
            $table->unsignedBigInteger('bank_account_id')->nullable();
            $table->enum('status', ['issued','pending','cleared','bounced','cancelled'])->default('issued');
            $table->text('narration')->nullable();
            $table->unsignedBigInteger('related_transaction_id')->nullable();

            $table->timestamps();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pdc_issued_companies');
    }
};
