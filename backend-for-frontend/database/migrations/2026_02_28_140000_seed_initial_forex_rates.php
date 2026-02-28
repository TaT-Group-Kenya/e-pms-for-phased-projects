<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // Set initial forex rates to KES as base currency.
        // These can be adjusted later via the UI.
        $rates = [
            'KES' => 1.0,
            'USD' => 128.45,
            'EUR' => 151.25,
            'GBP' => 178.13,
        ];

        foreach ($rates as $code => $rate) {
            DB::table('currencies')
                ->where('code', $code)
                ->update(['current_forex_rate' => $rate]);
        }
    }

    public function down(): void
    {
        // Revert rates back to 1.0 for the seeded currencies.
        $codes = ['KES', 'USD', 'EUR', 'GBP'];

        DB::table('currencies')
            ->whereIn('code', $codes)
            ->update(['current_forex_rate' => 1.0]);
    }
};
