<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quote_approval', function (Blueprint $table) {

            $table->id();

            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('quote_id');

            $table->enum('action', ['make','check']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quote_approval');
    }
};