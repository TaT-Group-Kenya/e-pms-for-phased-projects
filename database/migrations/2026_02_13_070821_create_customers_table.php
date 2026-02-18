<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {

            $table->id();

            $table->string('name');
            $table->text('description');
            $table->string('email');
            $table->string('phone');
            $table->string('contact_person_name');
            $table->string('logo');
            $table->string('address');
            $table->string('city');
            $table->string('state');
            $table->string('country');
            $table->string('kra_pin');

            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();

            $table->timestamp('created_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};