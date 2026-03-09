<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('company_banks', function (Blueprint $table) {
            $table->string('swiftcode')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('company_banks', function (Blueprint $table) {
            $table->string('swiftcode')->nullable(false)->change();
        });
    }
};
