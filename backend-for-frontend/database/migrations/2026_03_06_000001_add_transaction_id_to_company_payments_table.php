<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add transaction_id column if it does not exist
        if (! Schema::hasColumn('company_payments', 'transaction_id')) {
            Schema::table('company_payments', function (Blueprint $table) {
                $table->unsignedBigInteger('transaction_id')->nullable()->after('id');
            });
        }
    }

    public function down(): void
    {
        // Drop transaction_id column if it exists
        if (Schema::hasColumn('company_payments', 'transaction_id')) {
            Schema::table('company_payments', function (Blueprint $table) {
                $table->dropColumn('transaction_id');
            });
        }
    }
};
