<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Currency;

class CurrencySeeder extends Seeder
{
    public function run(): void
    {
        // The client operates KES and USD only (trial balance assumes the
        // two-currency world; KES is the base at rate 1, USD enters KES at
        // current_forex_rate).
        $currencies = [
            [
                'code' => 'KES',
                'name' => 'Kenyan Shilling',
                'description' => 'Kenyan Shilling',
                'current_forex_rate' => 1,
                'created_at' => now(),
                'created_by' => 1,
                'updated_at' => now(),
                'updated_by' => 1,
            ],
            [
                'code' => 'USD',
                'name' => 'US Dollar',
                'description' => 'US Dollar',
                'current_forex_rate' => 128.4500,
                'created_at' => now(),
                'created_by' => 1,
                'updated_at' => now(),
                'updated_by' => 1,
            ],
        ];
        
        foreach ($currencies as $currency) {
            Currency::upsert($currency, ['code'], ['name', 'description', 'current_forex_rate', 'created_at', 'created_by', 'updated_at', 'updated_by']);
        }
    }
}
