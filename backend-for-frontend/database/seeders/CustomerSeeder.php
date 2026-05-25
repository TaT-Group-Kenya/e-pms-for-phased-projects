<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Customer;
use Carbon\Carbon;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();
        
        $customers = [
            [
                'name' => 'ABC Manufacturing Ltd',
                'description' => 'Leading manufacturer of industrial equipment and machinery in East Africa',
                'email' => 'info@abcmanufacturing.co.ke',
                'phone' => '+254722334455',
                'contact_person_name' => 'Sifuna P. Sifuna',
                'logo' => '3311.png',
                'address' => '789 Industrial Area, Lunga Lunga Road',
                'city' => 'Nairobi',
                'state' => 'Nairobi County',
                'country' => 'Kenya',
                'kra_pin' => 'P051112233K',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => $now,
                'updated_at' => $now,
                'is_deleted' => false,
                'deleted_at' => null,
                'deleted_by' => null,
            ],
            [
                'name' => 'Highland Coffee Growers',
                'description' => 'Premium coffee growers and exporters based in the central highlands of Kenya',
                'email' => 'sales@highlandcoffee.co.ke',
                'phone' => '+254733445566',
                'contact_person_name' => 'Mary Wanjala',
                'logo' => '3311.png',
                'address' => '456 Coffee Estate, Kiambu Road',
                'city' => 'Kiambu',
                'state' => 'Kiambu County',
                'country' => 'Kenya',
                'kra_pin' => 'P052223344K',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => $now,
                'updated_at' => $now,
                'is_deleted' => false,
                'deleted_at' => null,
                'deleted_by' => null,
            ],
            [
                'name' => 'Coast Logistics Services',
                'description' => 'Comprehensive shipping and logistics solutions serving the port city of Mombasa',
                'email' => 'info@coastlogistics.co.ke',
                'phone' => '+254711556677',
                'contact_person_name' => 'Ahmed Hassan',
                'logo' => '3311.png',
                'address' => '123 Port Road, Mombasa CBD',
                'city' => 'Mombasa',
                'state' => 'Mombasa County',
                'country' => 'Kenya',
                'kra_pin' => 'P053334455K',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => $now,
                'updated_at' => $now,
                'is_deleted' => false,
                'deleted_at' => null,
                'deleted_by' => null,
            ]
        ];

        foreach ($customers as $customer) {
            Customer::upsert($customer, ['email']);
        }
    }
}