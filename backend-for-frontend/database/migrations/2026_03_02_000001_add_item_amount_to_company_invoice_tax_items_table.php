<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('company_invoice_tax_items', function (Blueprint $table) {
            if (!Schema::hasColumn('company_invoice_tax_items', 'item_amount')) {
                $table->decimal('item_amount', 15, 2)->default(0)->after('item_value');
            }
        });
    }

    public function down(): void
    {
        Schema::table('company_invoice_tax_items', function (Blueprint $table) {
            if (Schema::hasColumn('company_invoice_tax_items', 'item_amount')) {
                $table->dropColumn('item_amount');
            }
        });
    }
};
