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
            DepartmentSeeder::class,
            CompanySeeder::class,
            CustomerSeeder::class,
            SysConfigSeeder::class,
            ShipContainerSupportSeeder::class,
            ShipContainerSeeder::class,
            // SampleCustDebitNoteSeeder is disabled: it writes sample
            // financial rows (debit notes, payments, ledger entries) which
            // break the clean financial slate. Re-enable deliberately for
            // demos only — after FinanceCleanSlateSeeder.
            // SampleCustDebitNoteSeeder::class,
            FinanceCleanSlateSeeder::class,
        ]);
    }
}
