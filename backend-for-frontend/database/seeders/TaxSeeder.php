<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tax;

class TaxSeeder extends Seeder
{
    public function run(): void
    {
        $taxes = [
            ['VAT' => 'Value Added Tax', 'rate' => 16.00, 'is_default' => true], 
            ['GST' => 'Goods and Services Tax', 'rate' => 0, 'is_default' => false], 
            ['WHT' => 'Withholding Tax', 'rate' => 0, 'is_default' => false], 
            ['CORPORATE_TAX' => 'Corporate Tax', 'rate' => 0, 'is_default' => false], 
            ['SALES_TAX' => 'Sales Tax', 'rate' => 0, 'is_default' => false], 
            ['EXCISE_TAX' => 'Excise Tax', 'rate' => 0, 'is_default' => false], 
            ['DST' => 'Digital Services Tax', 'rate' => 0, 'is_default' => false]
        ];

        foreach ($taxes as $tax) {
            $key = array_key_first($tax);
            Tax::firstOrCreate([
                'code' => $key,
                'name' => $tax[$key], 
                'description' => $tax[$key],
                'rate' => $tax['rate'],
                'is_default' => $tax['is_default'],
                'created_at' => now(),
                'created_by' => 1,
                'updated_at' => now(),
                'updated_by' => 1,
            ]);
        }
    }
}
