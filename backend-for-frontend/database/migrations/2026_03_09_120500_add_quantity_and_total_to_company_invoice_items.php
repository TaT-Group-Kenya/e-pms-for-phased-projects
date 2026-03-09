<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('company_invoice_items', function (Blueprint $table) {
            if (! Schema::hasColumn('company_invoice_items', 'quantity')) {
                $table->integer('quantity')->default(1)->after('item_amount');
            }

            if (! Schema::hasColumn('company_invoice_items', 'total')) {
                $table->decimal('total', 15, 2)->nullable()->after('quantity');
            }
        });
    }

    public function down(): void
    {
        Schema::table('company_invoice_items', function (Blueprint $table) {
            if (Schema::hasColumn('company_invoice_items', 'total')) {
                $table->dropColumn('total');
            }

            if (Schema::hasColumn('company_invoice_items', 'quantity')) {
                $table->dropColumn('quantity');
            }
        });
    }
};
