<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {

            $table->id();

            $table->string('email');
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('password');

            $table->timestamp('email_verified_at')->useCurrent();

            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

            $table->timestamp('created_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();

            $table->string('remember_token')->nullable();
            $table->string('avatar_pic')->nullable();

            $table->enum('category', ['internal', 'company', 'customer']);
            $table->boolean('is_active');

            $table->unsignedBigInteger('company_id')->nullable();
            $table->unsignedBigInteger('customer_id')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};