<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pdc_issued_companies', function (Blueprint $table) {
            $table->decimal('forex_rate', 15, 6)->default(1.000000)->after('currency');
        });

        Schema::table('pdc_received_customers', function (Blueprint $table) {
            $table->decimal('forex_rate', 15, 6)->default(1.000000)->after('currency');
        });
    }

    public function down(): void
    {
        Schema::table('pdc_issued_companies', function (Blueprint $table) {
            $table->dropColumn('forex_rate');
        });

        Schema::table('pdc_received_customers', function (Blueprint $table) {
            $table->dropColumn('forex_rate');
        });
    }
};
