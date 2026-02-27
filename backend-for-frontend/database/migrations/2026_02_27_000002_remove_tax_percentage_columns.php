<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('tax_percentage');
        });

        Schema::table('cust_invoices', function (Blueprint $table) {
            $table->dropColumn('tax_percentage');
        });

        Schema::table('cust_credit_notes', function (Blueprint $table) {
            $table->dropColumn('tax_percentage');
        });

        Schema::table('company_invoices', function (Blueprint $table) {
            $table->dropColumn('tax_percentage');
        });

        Schema::table('company_credit_notes', function (Blueprint $table) {
            $table->dropColumn('tax_percentage');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('tax_percentage', 8, 2)->default(0);
        });

        Schema::table('cust_invoices', function (Blueprint $table) {
            $table->decimal('tax_percentage', 8, 2)->default(0);
        });

        Schema::table('cust_credit_notes', function (Blueprint $table) {
            $table->decimal('tax_percentage', 8, 2)->default(0);
        });

        Schema::table('company_invoices', function (Blueprint $table) {
            $table->decimal('tax_percentage', 5, 2)->default(0);
        });

        Schema::table('company_credit_notes', function (Blueprint $table) {
            $table->decimal('tax_percentage', 8, 2)->default(0);
        });
    }
};
