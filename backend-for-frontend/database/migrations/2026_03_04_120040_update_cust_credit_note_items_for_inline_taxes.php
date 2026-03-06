<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cust_credit_note_items', function (Blueprint $table) {
            if (! Schema::hasColumn('cust_credit_note_items', 'is_taxable')) {
                $table->boolean('is_taxable')->default(false)->after('item_amount');
            }

            if (! Schema::hasColumn('cust_credit_note_items', 'tax_id')) {
                $table->unsignedBigInteger('tax_id')->nullable()->after('is_taxable');
            }

            if (! Schema::hasColumn('cust_credit_note_items', 'tax_item_name')) {
                $table->string('tax_item_name')->nullable()->after('tax_id');
            }

            if (! Schema::hasColumn('cust_credit_note_items', 'item_type')) {
                $table->enum('item_type', ['fixed', 'percent'])->nullable()->after('tax_item_name');
            }

            if (! Schema::hasColumn('cust_credit_note_items', 'item_value')) {
                $table->decimal('item_value', 15, 2)->nullable()->after('item_type');
            }

            if (! Schema::hasColumn('cust_credit_note_items', 'tax_amount')) {
                $table->decimal('tax_amount', 15, 2)->default(0)->after('item_value');
            }
        });
    }

    public function down(): void
    {
        Schema::table('cust_credit_note_items', function (Blueprint $table) {
            if (Schema::hasColumn('cust_credit_note_items', 'tax_amount')) {
                $table->dropColumn('tax_amount');
            }
            if (Schema::hasColumn('cust_credit_note_items', 'item_value')) {
                $table->dropColumn('item_value');
            }
            if (Schema::hasColumn('cust_credit_note_items', 'item_type')) {
                $table->dropColumn('item_type');
            }
            if (Schema::hasColumn('cust_credit_note_items', 'tax_item_name')) {
                $table->dropColumn('tax_item_name');
            }
            if (Schema::hasColumn('cust_credit_note_items', 'tax_id')) {
                $table->dropColumn('tax_id');
            }
            if (Schema::hasColumn('cust_credit_note_items', 'is_taxable')) {
                $table->dropColumn('is_taxable');
            }
        });
    }
};
