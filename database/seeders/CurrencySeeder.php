<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Currency;

class CurrencySeeder extends Seeder
{
    public function run(): void
    {
        $currencies = [
            [
                'code' => 'KES',
                'name' => 'Kenyan Shilling',
                'description' => 'Kenyan Shilling',
                'created_at' => now(),
                'created_by' => 1,
                'updated_at' => now(),
                'updated_by' => 1,
            ],
            [
                'code' => 'USD',
                'name' => 'US Dollar',
                'description' => 'US Dollar',
                'created_at' => now(),
                'created_by' => 1,
                'updated_at' => now(),
                'updated_by' => 1,
            ],
            [
                'code' => 'EUR',
                'name' => 'Euro',
                'description' => 'Euro',
                'created_at' => now(),
                'created_by' => 1,
                'updated_at' => now(),
                'updated_by' => 1,
            ],
            [
                'code' => 'GBP',
                'name' => 'British Pound',
                'description' => 'British Pound',
                'created_at' => now(),
                'created_by' => 1,
                'updated_at' => now(),
                'updated_by' => 1,
            ],
        ];
        
        foreach ($currencies as $currency) {
            Currency::firstOrCreate($currency);
        }
    }
}
