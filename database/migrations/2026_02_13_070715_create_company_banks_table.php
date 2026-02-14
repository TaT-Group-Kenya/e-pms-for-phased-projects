<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_banks', function (Blueprint $table) {

            $table->id();

            $table->unsignedBigInteger('company_id');
            $table->enum('type', ['Bank', 'MPESA']);

            $table->string('account_no');
            $table->string('swiftcode');
            $table->string('branch');
            $table->string('account_holder_name');

            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

            $table->timestamp('created_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_banks');
    }
};