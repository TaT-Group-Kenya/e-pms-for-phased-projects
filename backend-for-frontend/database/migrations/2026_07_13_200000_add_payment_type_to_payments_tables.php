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
        // Add payment_type column to company_payments table
        Schema::table('company_payments', function (Blueprint $table) {
            $table->enum('payment_type', ['normal', 'expense_entry'])->default('normal')->after('transaction_cost');
        });

        // Add payment_type column to cust_payments table
        Schema::table('cust_payments', function (Blueprint $table) {
            $table->enum('payment_type', ['normal', 'expense_entry'])->default('normal')->after('transaction_cost');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove payment_type column from company_payments table
        Schema::table('company_payments', function (Blueprint $table) {
            $table->dropColumn('payment_type');
        });

        // Remove payment_type column from cust_payments table
        Schema::table('cust_payments', function (Blueprint $table) {
            $table->dropColumn('payment_type');
        });
    }
};
