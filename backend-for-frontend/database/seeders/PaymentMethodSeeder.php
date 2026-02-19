<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PaymentMethod;

class PaymentMethodSeeder extends Seeder
{
    public function run(): void
    {
        $methods = ['CASH' => 'Cash', 'MPESA' => 'Mpesa', 'BANK_TRANSFER' => 'Bank Transfer', 'CHECK' => 'Check'];

        foreach ($methods as $key => $value) {
            PaymentMethod::firstOrCreate([
                'name' => $key, 
                'description' => $value,
                'created_at' => now(),
                'created_by' => 1,
                'updated_at' => now(),
                'updated_by' => 1,
            ]);
        }
    }
}
