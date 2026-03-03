<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Remove any orphaned tax items that do not have an associated tax
        DB::table('company_invoice_tax_items')
            ->whereNull('tax_id')
            ->delete();

        Schema::table('company_invoice_tax_items', function (Blueprint $table) {
            // Enforce non-nullable tax_id now that existing nulls are cleaned up
            $table->unsignedBigInteger('tax_id')->nullable(false)->change();
        });
    }

    public function down(): void
    {
        Schema::table('company_invoice_tax_items', function (Blueprint $table) {
            // Allow tax_id to be nullable again if this migration is rolled back
            $table->unsignedBigInteger('tax_id')->nullable()->change();
        });
    }
};
