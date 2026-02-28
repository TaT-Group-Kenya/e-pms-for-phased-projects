<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Ensure we can safely drop columns involved in foreign keys
        Schema::disableForeignKeyConstraints();

        Schema::table('cust_payments', function (Blueprint $table) {
            if (Schema::hasColumn('cust_payments', 'transaction_id')) {
                // Drop FK constraint before dropping the column
                // Use the explicit constraint name to avoid issues
                $table->dropForeign('cust_payments_transaction_id_foreign');
                $table->dropColumn('transaction_id');
            }

            // Ensure transaction_number exists and has a unique index
            if (Schema::hasColumn('cust_payments', 'transaction_number')) {
                $table->unique('transaction_number');
            }
        });

        Schema::table('company_payments', function (Blueprint $table) {
            if (Schema::hasColumn('company_payments', 'transaction_id')) {
                // Drop FK constraint before dropping the column
                $table->dropForeign('company_payments_transaction_id_foreign');
                $table->dropColumn('transaction_id');
            }

            if (Schema::hasColumn('company_payments', 'transaction_number')) {
                $table->unique('transaction_number');
            }
        });

        Schema::table('customer_transactions_ledger', function (Blueprint $table) {
            if (Schema::hasColumn('customer_transactions_ledger', 'transaction_id')) {
                $table->dropColumn('transaction_id');
            }
            // transaction_number is already unique from the original create-table migration
        });

        Schema::enableForeignKeyConstraints();
    }

    public function down(): void
    {
        Schema::table('cust_payments', function (Blueprint $table) {
            if (!Schema::hasColumn('cust_payments', 'transaction_id')) {
                $table->unsignedBigInteger('transaction_id')->nullable()->after('id');
                // Restore FK constraint to transactions table (original setup)
                $table->foreign('transaction_id')
                    ->references('id')
                    ->on('transactions')
                    ->onDelete('cascade');
            }

            // Drop the unique index on transaction_number if it exists
            if (Schema::hasColumn('cust_payments', 'transaction_number')) {
                $table->dropUnique('cust_payments_transaction_number_unique');
            }
        });

        Schema::table('customer_transactions_ledger', function (Blueprint $table) {
            if (!Schema::hasColumn('customer_transactions_ledger', 'transaction_id')) {
                $table->unsignedBigInteger('transaction_id')->nullable()->after('id');
            }
        });

        Schema::table('company_payments', function (Blueprint $table) {
            if (!Schema::hasColumn('company_payments', 'transaction_id')) {
                $table->unsignedBigInteger('transaction_id')->nullable()->after('id');
                $table->foreign('transaction_id')
                    ->references('id')
                    ->on('transactions')
                    ->onDelete('cascade');
            }

            if (Schema::hasColumn('company_payments', 'transaction_number')) {
                $table->dropUnique('company_payments_transaction_number_unique');
            }
        });

    }
};
