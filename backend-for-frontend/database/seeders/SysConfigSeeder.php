<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SysConfig;
use Carbon\Carbon;

class SysConfigSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();
        $userId = 1;
        $configs = [
            ['name' => 'PAY_METHOD_MPESA_PAYBILL', 'value' => '247247'],
            ['name' => 'PAY_METHOD_MPESA_ACCOUNT', 'value' => 'use invoice number for account'],
            ['name' => 'PAY_METHOD_BANK_HOLDER_NAME', 'value' => 'Infosol Kenya Limited'],
            ['name' => 'PAY_METHOD_BANK_ACCOUNT_NUMBER', 'value' => '1333400700800'],
            ['name' => 'PAY_METHOD_BANK_NAME', 'value' => 'Equity Bank'],
            ['name' => 'PAY_METHOD_BANK_BRANCH', 'value' => 'Kimathi branch (003)'],
            ['name' => 'PAY_METHOD_BANK_IBAN', 'value' => '3434343'],
            ['name' => 'PAY_METHOD_BANK_SWIFT_CODE', 'value' => 'KEXIDHF09'],
            ['name' => 'NAME', 'value' => 'Infosol Kenya Ltd'],
            ['name' => 'EMAIL', 'value' => 'info@infosolkenyaltd.com'],
            ['name' => 'ADDRESS_LINE_1', 'value' => '1148 Valley Road Park'],
            ['name' => 'CITY', 'value' => 'Nairobi'],
            ['name' => 'STATE', 'value' => 'Nairobi'],
            ['name' => 'COUNTRY', 'value' => 'Kenya'],
            ['name' => 'PHONE', 'value' => '254700000000'],
            ['name' => 'WEBSITE', 'value' => 'www.infosolkenya.com'],
        ];

        foreach ($configs as $config) {
            SysConfig::updateOrCreate(
                ['name' => $config['name']],
                [
                    'value' => $config['value'],
                    'created_at' => $now,
                    'created_by' => $userId,
                    'is_deleted' => false,
                ]
            );
        }
    }
}
