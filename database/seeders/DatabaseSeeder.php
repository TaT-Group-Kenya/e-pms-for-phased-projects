<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            SysRoleSeeder::class,
            SysGroupSeeder::class,
            GroupRoleSeeder::class,
            AccountGroupSeeder::class,
            AccountTypeSeeder::class,
            UserSeeder::class,
            UserGroupSeeder::class,
            PaymentMethodSeeder::class,
            TaxSeeder::class,
            LanguageSeeder::class,
            CountrySeeder::class,
            CurrencySeeder::class,
        ]);
    }
}
