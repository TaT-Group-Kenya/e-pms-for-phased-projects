<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tax;

class TaxSeeder extends Seeder
{
    public function run(): void
    {
        $taxes = ['VAT' => 'Value Added Tax', 'GST' => 'Goods and Services Tax', 'WHT' => 'Withholding Tax', 'CORPORATE_TAX' => 'Corporate Tax', 'SALES_TAX' => 'Sales Tax', 'EXCISE_TAX' => 'Excise Tax', 'DST' => 'Digital Services Tax'];

        foreach ($taxes as $key => $value) {
            Tax::firstOrCreate([
                'code' => $key,
                'name' => $value, 
                'description' => $value,
                'created_at' => now(),
                'created_by' => 1,
                'updated_at' => now(),
                'updated_by' => 1,
            ]);
        }
    }
}
