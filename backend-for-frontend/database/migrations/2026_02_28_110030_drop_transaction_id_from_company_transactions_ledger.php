<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('company_transactions_ledger', function (Blueprint $table) {
            if (Schema::hasColumn('company_transactions_ledger', 'transaction_id')) {
                $table->dropColumn('transaction_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('company_transactions_ledger', function (Blueprint $table) {
            if (!Schema::hasColumn('company_transactions_ledger', 'transaction_id')) {
                $table->unsignedBigInteger('transaction_id')->nullable()->after('id');
            }
        });
    }
};
