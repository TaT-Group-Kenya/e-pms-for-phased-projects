<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cust_payments', function (Blueprint $table) {
            if (! Schema::hasColumn('cust_payments', 'tax_amount')) {
                $table->decimal('tax_amount', 15, 2)->default(0)->after('amount_paid');
            }

            if (! Schema::hasColumn('cust_payments', 'net_amount')) {
                $table->decimal('net_amount', 15, 2)->default(0)->after('tax_amount');
            }
        });

        Schema::table('company_payments', function (Blueprint $table) {
            if (! Schema::hasColumn('company_payments', 'tax_amount')) {
                $table->decimal('tax_amount', 15, 2)->default(0)->after('amount_paid');
            }

            if (! Schema::hasColumn('company_payments', 'net_amount')) {
                $table->decimal('net_amount', 15, 2)->default(0)->after('tax_amount');
            }
        });
    }

    public function down(): void
    {
        Schema::table('cust_payments', function (Blueprint $table) {
            if (Schema::hasColumn('cust_payments', 'tax_amount')) {
                $table->dropColumn('tax_amount');
            }

            if (Schema::hasColumn('cust_payments', 'net_amount')) {
                $table->dropColumn('net_amount');
            }
        });

        Schema::table('company_payments', function (Blueprint $table) {
            if (Schema::hasColumn('company_payments', 'tax_amount')) {
                $table->dropColumn('tax_amount');
            }

            if (Schema::hasColumn('company_payments', 'net_amount')) {
                $table->dropColumn('net_amount');
            }
        });
    }
};
