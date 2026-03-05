<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            if (! Schema::hasColumn('order_items', 'tax_id')) {
                $table->unsignedBigInteger('tax_id')->nullable()->after('is_taxable');
            }

            if (! Schema::hasColumn('order_items', 'tax_item_name')) {
                $table->string('tax_item_name')->nullable()->after('tax_id');
            }

            if (! Schema::hasColumn('order_items', 'item_type')) {
                $table->enum('item_type', ['fixed', 'percent'])->nullable()->after('tax_item_name');
            }

            if (! Schema::hasColumn('order_items', 'item_value')) {
                $table->decimal('item_value', 15, 2)->nullable()->after('item_type');
            }

            if (! Schema::hasColumn('order_items', 'item_amount')) {
                $table->decimal('item_amount', 15, 2)->default(0)->after('item_value');
            }
        });
    }

    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            if (Schema::hasColumn('order_items', 'item_amount')) {
                $table->dropColumn('item_amount');
            }
            if (Schema::hasColumn('order_items', 'item_value')) {
                $table->dropColumn('item_value');
            }
            if (Schema::hasColumn('order_items', 'item_type')) {
                $table->dropColumn('item_type');
            }
            if (Schema::hasColumn('order_items', 'tax_item_name')) {
                $table->dropColumn('tax_item_name');
            }
            if (Schema::hasColumn('order_items', 'tax_id')) {
                $table->dropColumn('tax_id');
            }
        });
    }
};
