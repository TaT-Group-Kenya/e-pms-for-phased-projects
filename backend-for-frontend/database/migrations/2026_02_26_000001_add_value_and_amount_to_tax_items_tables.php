<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('company_credit_note_tax_items', function (Blueprint $table) {
            $table->decimal('item_value', 15, 2)->nullable()->after('item_type');
            $table->decimal('item_amount', 15, 2)->nullable()->after('item_value');
        });

        Schema::table('company_invoice_tax_items', function (Blueprint $table) {
            if (! Schema::hasColumn('company_invoice_tax_items', 'item_value')) {
                $table->decimal('item_value', 15, 2)->nullable()->after('item_type');
            }
            $table->decimal('item_amount', 15, 2)->nullable()->after('item_value');
        });

        Schema::table('cust_credit_note_tax_items', function (Blueprint $table) {
            $table->decimal('item_value', 15, 2)->nullable()->after('item_type');
            $table->decimal('item_amount', 15, 2)->nullable()->after('item_value');
        });

        Schema::table('cust_invoice_tax_items', function (Blueprint $table) {
            $table->decimal('item_value', 15, 2)->nullable()->after('item_type');
            $table->decimal('item_amount', 15, 2)->nullable()->after('item_value');
        });

        Schema::table('order_tax_items', function (Blueprint $table) {
            $table->decimal('item_value', 15, 2)->nullable()->after('item_type');
            $table->decimal('item_amount', 15, 2)->nullable()->after('item_value');
        });
    }

    public function down(): void
    {
        Schema::table('company_credit_note_tax_items', function (Blueprint $table) {
            $table->dropColumn(['item_value', 'item_amount']);
        });

        Schema::table('company_invoice_tax_items', function (Blueprint $table) {
            $table->dropColumn(['item_value', 'item_amount']);
        });

        Schema::table('cust_credit_note_tax_items', function (Blueprint $table) {
            $table->dropColumn(['item_value', 'item_amount']);
        });

        Schema::table('cust_invoice_tax_items', function (Blueprint $table) {
            $table->dropColumn(['item_value', 'item_amount']);
        });

        Schema::table('order_tax_items', function (Blueprint $table) {
            $table->dropColumn(['item_value', 'item_amount']);
        });
    }
};
