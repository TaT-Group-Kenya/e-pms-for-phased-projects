<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Customer payments
        Schema::table('cust_payments', function (Blueprint $table) {
            if (! Schema::hasColumn('cust_payments', 'direction')) {
                $table->enum('direction', ['incoming', 'outgoing'])->default('incoming')->after('amount_paid');
            }
            if (! Schema::hasColumn('cust_payments', 'transaction_type')) {
                $table->enum('transaction_type', ['receipt', 'refund'])->default('receipt')->after('direction');
            }
        });

        // Company payments
        Schema::table('company_payments', function (Blueprint $table) {
            if (! Schema::hasColumn('company_payments', 'direction')) {
                $table->enum('direction', ['incoming', 'outgoing'])->default('outgoing')->after('amount_paid');
            }
            if (! Schema::hasColumn('company_payments', 'transaction_type')) {
                $table->enum('transaction_type', ['receipt', 'refund'])->default('receipt')->after('direction');
            }
        });
    }

    public function down(): void
    {
        Schema::table('cust_payments', function (Blueprint $table) {
            if (Schema::hasColumn('cust_payments', 'transaction_type')) {
                $table->dropColumn('transaction_type');
            }
            if (Schema::hasColumn('cust_payments', 'direction')) {
                $table->dropColumn('direction');
            }
        });

        Schema::table('company_payments', function (Blueprint $table) {
            if (Schema::hasColumn('company_payments', 'transaction_type')) {
                $table->dropColumn('transaction_type');
            }
            if (Schema::hasColumn('company_payments', 'direction')) {
                $table->dropColumn('direction');
            }
        });
    }
};
