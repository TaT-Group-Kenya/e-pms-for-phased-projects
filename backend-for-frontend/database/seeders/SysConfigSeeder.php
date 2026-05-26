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
            ['readonly' => true, 'name' => 'CUST_INVOICE_PREFIX', 'value' => 'CINV-'],
            ['readonly' => true, 'name' => 'CUST_INVOICE_INCREMENT', 'value' => '1'],
            ['readonly' => true, 'name' => 'CUST_INVOICE_NUMBER_LENGTH', 'value' => '6'],
            
            ['readonly' => true, 'name' => 'CUST_CREDIT_NOTE_PREFIX', 'value' => 'CCN-'],
            ['readonly' => true, 'name' => 'CUST_CREDIT_NOTE_INCREMENT', 'value' => '1'],
            ['readonly' => true, 'name' => 'CUST_CREDIT_NOTE_NUMBER_LENGTH', 'value' => '6'],
            
            ['readonly' => true, 'name' => 'COMPANY_INVOICE_PREFIX', 'value' => 'CMPINV-'],
            ['readonly' => true, 'name' => 'COMPANY_INVOICE_INCREMENT', 'value' => '1'],
            ['readonly' => true, 'name' => 'COMPANY_INVOICE_NUMBER_LENGTH', 'value' => '6'],

            ['readonly' => true, 'name' => 'COMPANY_CREDIT_NOTE_PREFIX', 'value' => 'CMPCN-'],
            ['readonly' => true, 'name' => 'COMPANY_CREDIT_NOTE_INCREMENT', 'value' => '1'],
            ['readonly' => true, 'name' => 'COMPANY_CREDIT_NOTE_NUMBER_LENGTH', 'value' => '6'],
            
            ['readonly' => true, 'name' => 'ORDER_NUMBER_PREFIX', 'value' => 'ORD-'],
            ['readonly' => true, 'name' => 'ORDER_NUMBER_INCREMENT', 'value' => '1'],
            ['readonly' => true, 'name' => 'ORDER_NUMBER_LENGTH', 'value' => '6'],

            ['readonly' => true, 'name' => 'QUOTATION_NUMBER_PREFIX', 'value' => 'QUO-'],
            ['readonly' => true, 'name' => 'QUOTATION_NUMBER_INCREMENT', 'value' => '1'],
            ['readonly' => true, 'name' => 'QUOTATION_NUMBER_LENGTH', 'value' => '6'],

            ['readonly' => true, 'name' => 'NAME', 'value' => 'Infosol Kenya Ltd'],
            ['readonly' => true, 'name' => 'EMAIL', 'value' => 'info@infosolkenyaltd.com'],
            ['readonly' => true, 'name' => 'ADDRESS_LINE_1', 'value' => '1148 Valley Road Park'],
            ['readonly' => true, 'name' => 'CITY', 'value' => 'Nairobi'],
            ['readonly' => true, 'name' => 'STATE', 'value' => 'Nairobi'],
            ['readonly' => true, 'name' => 'COUNTRY', 'value' => 'Kenya'],
            ['readonly' => true, 'name' => 'PHONE', 'value' => '254700000000'],
            ['readonly' => true, 'name' => 'WEBSITE', 'value' => 'www.infosolkenya.com'],
            ['readonly' => true, 'name' => 'SESSION_MAX_LIMIT_IN_MINUTES', 'value' => '10'],
            ['readonly' => true, 'name' => 'INSTANCE_LOGO', 'value' => public_path('logo.png'), 'is_file' => true],
        ];

        foreach ($configs as $config) {
            SysConfig::updateOrCreate(
                ['name' => $config['name']],
                [
                    'value' => $config['value'],
                    'is_file' => $config['is_file'] ?? false,
                    'created_at' => $now,
                    'created_by' => $userId,
                    'is_deleted' => false,
                    'readonly' => $config['readonly'],
                ]
            );
        }
    }
}
