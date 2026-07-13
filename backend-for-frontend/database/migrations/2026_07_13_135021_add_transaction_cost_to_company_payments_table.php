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
        Schema::table('company_payments', function (Blueprint $table) {
            $table->decimal('transaction_cost', 10, 2)->default(0.00)->after('settlement_account_forex_rate')->nullable();
        });

        Schema::table('cust_payments', function (Blueprint $table) {
            $table->decimal('transaction_cost', 10, 2)->default(0.00)->after('fee_or_charge')->nullable();
        });

        Schema::table('office_expense_payments', function (Blueprint $table) {
            $table->decimal('transaction_cost', 10, 2)->default(0.00)->after('exchange_rate')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('company_payments', function (Blueprint $table) {
            $table->dropColumn('transaction_cost');
        });

        Schema::table('cust_payments', function (Blueprint $table) {
            $table->dropColumn('transaction_cost');
        });

        Schema::table('office_expense_payments', function (Blueprint $table) {
            $table->dropColumn('transaction_cost');
        });
    }
};
