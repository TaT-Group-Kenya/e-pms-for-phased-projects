<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PaymentReceivingMethod;

class PaymentReceivingMethodSeeder extends Seeder
{
    public function run(): void
    {
        $methods = [
            [
                'type' => 'Bank',
                'name' => 'Equity Bank',
                'currency' => 'KES',
                'instruction' => 'Deposit at any Equity branch',
                'paybill' => null,
                'account_holder_name' => 'InfoSol Kenya Ltd',
                'account_number' => '1234567890',
                'bank' => 'Equity',
                'branch' => 'Upper Hill',
                'swift_code' => 'EQBLKENA',
                'iban' => null,
                'status' => 'active',
            ],
            [
                'type' => 'MPesa',
                'name' => 'Safaricom MPesa',
                'currency' => 'KES',
                'instruction' => 'Use Paybill to pay',
                'paybill' => '123456',
                'account_holder_name' => 'InfoSol Kenya Ltd',
                'account_number' => 'use invoice number',
                'bank' => null,
                'branch' => null,
                'swift_code' => null,
                'iban' => null,
                'status' => 'active',
            ],
            [
                'type' => 'Other',
                'name' => 'Cash Office',
                'currency' => 'KES',
                'instruction' => 'Pay at the office',
                'paybill' => null,
                'account_holder_name' => 'InfoSol Kenya Ltd',
                'account_number' => 'use invoice number',
                'bank' => null,
                'branch' => null,
                'swift_code' => null,
                'iban' => null,
                'status' => 'active',
            ],
        ];

        foreach ($methods as $data) {
            PaymentReceivingMethod::firstOrCreate(
                [
                    'type' => $data['type'],
                    'name' => $data['name'],
                ],
                array_merge($data, [
                    'created_at' => now(),
                    'created_by' => 1,
                    'updated_at' => now(),
                    'updated_by' => 1,
                ])
            );
        }
    }
}
