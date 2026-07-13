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
            $table->decimal('settlement_account_forex_rate', 10, 2)->default(1.00)->after('forex_rate')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('company_payments', function (Blueprint $table) {
            $table->dropColumn('settlement_account_forex_rate');
        });
    }
};
