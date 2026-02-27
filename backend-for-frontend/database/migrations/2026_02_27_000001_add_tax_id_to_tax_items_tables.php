<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('order_tax_items', function (Blueprint $table) {
            $table->unsignedBigInteger('tax_id')->nullable()->after('order_id');
            $table->foreign('tax_id')->references('id')->on('taxes');
        });

        Schema::table('company_invoice_tax_items', function (Blueprint $table) {
            $table->unsignedBigInteger('tax_id')->nullable()->after('invoice_id');
            $table->foreign('tax_id')->references('id')->on('taxes');
        });

        Schema::table('company_credit_note_tax_items', function (Blueprint $table) {
            $table->unsignedBigInteger('tax_id')->nullable()->after('credit_note_id');
            $table->foreign('tax_id')->references('id')->on('taxes');
        });

        Schema::table('cust_invoice_tax_items', function (Blueprint $table) {
            $table->unsignedBigInteger('tax_id')->nullable()->after('invoice_id');
            $table->foreign('tax_id')->references('id')->on('taxes');
        });

        Schema::table('cust_credit_note_tax_items', function (Blueprint $table) {
            $table->unsignedBigInteger('tax_id')->nullable()->after('credit_note_id');
            $table->foreign('tax_id')->references('id')->on('taxes');
        });
    }

    public function down(): void
    {
        Schema::table('order_tax_items', function (Blueprint $table) {
            $table->dropForeign(['tax_id']);
            $table->dropColumn('tax_id');
        });

        Schema::table('company_invoice_tax_items', function (Blueprint $table) {
            $table->dropForeign(['tax_id']);
            $table->dropColumn('tax_id');
        });

        Schema::table('company_credit_note_tax_items', function (Blueprint $table) {
            $table->dropForeign(['tax_id']);
            $table->dropColumn('tax_id');
        });

        Schema::table('cust_invoice_tax_items', function (Blueprint $table) {
            $table->dropForeign(['tax_id']);
            $table->dropColumn('tax_id');
        });

        Schema::table('cust_credit_note_tax_items', function (Blueprint $table) {
            $table->dropForeign(['tax_id']);
            $table->dropColumn('tax_id');
        });
    }
};
