<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cust_payments', function (Blueprint $table) {
            if (!Schema::hasColumn('cust_payments', 'transaction_number')) {
                $table->string('transaction_number')->nullable()->after('transaction_id');
            }
        });

        Schema::table('company_payments', function (Blueprint $table) {
            if (!Schema::hasColumn('company_payments', 'transaction_number')) {
                $table->string('transaction_number')->nullable()->after('transaction_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('cust_payments', function (Blueprint $table) {
            if (Schema::hasColumn('cust_payments', 'transaction_number')) {
                $table->dropColumn('transaction_number');
            }
        });

        Schema::table('company_payments', function (Blueprint $table) {
            if (Schema::hasColumn('company_payments', 'transaction_number')) {
                $table->dropColumn('transaction_number');
            }
        });
    }
};
