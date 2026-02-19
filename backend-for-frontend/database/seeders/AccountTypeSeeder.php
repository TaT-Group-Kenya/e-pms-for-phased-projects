<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AccountType;

class AccountTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = ['CASH' => 'Cash', 'MPESA' => 'Mpesa', 'BANK' => 'Bank'];

        foreach ($types as $key => $value) {
            AccountType::firstOrCreate([
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
