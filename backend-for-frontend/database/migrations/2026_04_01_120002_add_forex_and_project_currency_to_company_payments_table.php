<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('company_payments', function (Blueprint $table) {
            $table->decimal('forex_rate', 15, 6)->default(1.000000)->after('exchange_rate');
            $table->decimal('project_currency_value', 15, 2)->default(0.00)->after('forex_rate');
            $table->string('project_currency', 10)->nullable()->after('project_currency_value');
        });
    }

    public function down(): void
    {
        Schema::table('company_payments', function (Blueprint $table) {
            $table->dropColumn(['forex_rate', 'project_currency_value', 'project_currency']);
        });
    }
};
