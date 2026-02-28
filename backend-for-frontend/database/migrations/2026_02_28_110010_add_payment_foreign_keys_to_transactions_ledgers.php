<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('customer_transactions_ledger', function (Blueprint $table) {
            if (!Schema::hasColumn('customer_transactions_ledger', 'cust_payment_id')) {
                $table->unsignedBigInteger('cust_payment_id')->nullable()->after('transaction_id');
                $table->foreign('cust_payment_id')
                    ->references('id')
                    ->on('cust_payments')
                    ->onDelete('cascade');
            }
        });

        Schema::table('company_transactions_ledger', function (Blueprint $table) {
            if (!Schema::hasColumn('company_transactions_ledger', 'company_payment_id')) {
                $table->unsignedBigInteger('company_payment_id')->nullable()->after('transaction_id');
                $table->foreign('company_payment_id')
                    ->references('id')
                    ->on('company_payments')
                    ->onDelete('cascade');
            }
        });
    }

    public function down(): void
    {
        Schema::table('customer_transactions_ledger', function (Blueprint $table) {
            if (Schema::hasColumn('customer_transactions_ledger', 'cust_payment_id')) {
                $table->dropForeign(['cust_payment_id']);
                $table->dropColumn('cust_payment_id');
            }
        });

        Schema::table('company_transactions_ledger', function (Blueprint $table) {
            if (Schema::hasColumn('company_transactions_ledger', 'company_payment_id')) {
                $table->dropForeign(['company_payment_id']);
                $table->dropColumn('company_payment_id');
            }
        });
    }
};
