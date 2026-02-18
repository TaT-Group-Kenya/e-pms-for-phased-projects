<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AccountGroup;

class AccountGroupSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            'PETTY' => 'Petty',
            'CHECKING' => 'Checking',
            'SAVINGS' => 'Savings',
        ];

        foreach ($items as $name => $description) {
            AccountGroup::firstOrCreate(
                ['name' => $name],
                ['description' => $description],
                ['created_at' => now(), 'created_by' => 1, 'updated_at' => now(), 'updated_by' => 1]
            );
        }
    }
}
