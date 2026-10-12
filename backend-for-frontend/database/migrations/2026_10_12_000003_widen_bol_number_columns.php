<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

return new class extends Migration
{
    /**
     * bol_number is no longer a single BOL — it carries the comma-joined
     * container numbers of the linked ship container entry.
     */
    public function up(): void
    {
        Schema::table('quotations', function (Blueprint $table) {
            $table->string('bol_number', 500)->nullable()->change();
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->string('bol_number', 500)->nullable()->change();
        });

        Schema::table('cust_invoices', function (Blueprint $table) {
            $table->string('bol_number', 500)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('quotations', function (Blueprint $table) {
            $table->string('bol_number', 32)->nullable()->change();
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->string('bol_number', 32)->nullable()->change();
        });

        Schema::table('cust_invoices', function (Blueprint $table) {
            $table->string('bol_number', 32)->nullable()->change();
        });
    }
};
