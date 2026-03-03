<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('company_transactions_ledger', function (Blueprint $table) {
            $table->string('transaction_currency', 10)->nullable()->after('amount');
            $table->decimal('converted_tax_amount', 15, 2)->nullable()->after('converted_amount');
            $table->decimal('converted_net_amount', 15, 2)->nullable()->after('converted_tax_amount');
        });

        Schema::table('customer_transactions_ledger', function (Blueprint $table) {
            $table->string('transaction_currency', 10)->nullable()->after('amount');
            $table->decimal('converted_tax_amount', 15, 2)->nullable()->after('converted_amount');
            $table->decimal('converted_net_amount', 15, 2)->nullable()->after('converted_tax_amount');
        });
    }

    public function down(): void
    {
        Schema::table('company_transactions_ledger', function (Blueprint $table) {
            $table->dropColumn(['transaction_currency', 'converted_tax_amount', 'converted_net_amount']);
        });

        Schema::table('customer_transactions_ledger', function (Blueprint $table) {
            $table->dropColumn(['transaction_currency', 'converted_tax_amount', 'converted_net_amount']);
        });
    }
};
