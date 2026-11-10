<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // The client works with KES and USD only. Accounts denominated in
        // removed currencies (e.g. the EUR "Euro account") are remapped to
        // USD — client instruction, not in production.
        Schema::disableForeignKeyConstraints();

        $removing = DB::table('currencies')->whereNotIn('code', ['KES', 'USD'])->pluck('code');

        if ($removing->isNotEmpty()) {
            // 1) Remap dependent accounts to USD.
            DB::table('accounts')->whereIn('currency', $removing)->update(['currency' => 'USD']);

            // 2) Drop forex-rate rows referencing removed currencies.
            if (Schema::hasTable('forex_rates')) {
                foreach ($removing as $code) {
                    $currencyId = DB::table('currencies')->where('code', $code)->value('id');
                    if ($currencyId) {
                        DB::table('forex_rates')->where(function ($q) use ($currencyId) {
                            $q->where('from_currency_id', $currencyId)->orWhere('to_currency_id', $currencyId);
                        })->delete();
                    }
                }
            }

            // 3) Remove the currencies themselves.
            DB::table('currencies')->whereNotIn('code', ['KES', 'USD'])->delete();
        }

        Schema::enableForeignKeyConstraints();
    }

    public function down(): void
    {
        // Restore the removed currencies as lookups (rates are historical).
        DB::table('currencies')->insertOrIgnore([
            ['code' => 'EUR', 'name' => 'Euro', 'description' => 'Euro', 'current_forex_rate' => 151.2000],
            ['code' => 'GBP', 'name' => 'British Pound', 'description' => 'British Pound', 'current_forex_rate' => 176.3500],
        ]);
    }
};
