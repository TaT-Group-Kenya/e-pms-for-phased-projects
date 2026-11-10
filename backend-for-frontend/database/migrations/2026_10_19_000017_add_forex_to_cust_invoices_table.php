<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Default applied to existing non-KES invoices (rate in effect when the
    // two-currency world was adopted). KES rows keep 1.
    private const DEFAULT_FOREIGN_RATE = 129.75;

    public function up(): void
    {
        Schema::table('cust_invoices', function ($table) {
            $table->decimal('forex_rate', 15, 6)->default(1)->after('currency');
            $table->decimal('subtotal_converted', 15, 2)->default(0)->after('subtotal_amount');
            $table->decimal('tax_converted', 15, 2)->default(0)->after('tax_amount');
            $table->decimal('discount_converted', 15, 2)->default(0)->after('discount_amount');
            $table->decimal('total_converted', 15, 2)->default(0)->after('total_amount');
        });

        // Backfill: KES rows keep rate 1 (amounts already base); non-KES
        // rows adopt the default foreign rate with their amounts converted.
        DB::table('cust_invoices')->update([
            'forex_rate' => DB::raw("CASE WHEN currency = 'KES' THEN 1 ELSE ".self::DEFAULT_FOREIGN_RATE." END"),
        ]);

        $driver = DB::connection()->getDriverName();

        if ($driver === 'sqlite') {
            DB::table('cust_invoices')->update([
                'subtotal_converted' => DB::raw('ROUND(subtotal_amount * forex_rate, 2)'),
                'tax_converted' => DB::raw('ROUND(tax_amount * forex_rate, 2)'),
                'discount_converted' => DB::raw('ROUND(discount_amount * forex_rate, 2)'),
                'total_converted' => DB::raw('ROUND(total_amount * forex_rate, 2)'),
            ]);
        } else {
            DB::statement('UPDATE cust_invoices SET
                subtotal_converted = ROUND(subtotal_amount * forex_rate, 2),
                tax_converted = ROUND(tax_amount * forex_rate, 2),
                discount_converted = ROUND(discount_amount * forex_rate, 2),
                total_converted = ROUND(total_amount * forex_rate, 2)');
        }
    }

    public function down(): void
    {
        Schema::table('cust_invoices', function ($table) {
            $table->dropColumn([
                'forex_rate',
                'subtotal_converted',
                'tax_converted',
                'discount_converted',
                'total_converted',
            ]);
        });
    }
};
