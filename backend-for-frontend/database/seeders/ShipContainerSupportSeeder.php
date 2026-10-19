<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\ProjectLocation;
use App\Models\ProjectOwner;
use Illuminate\Database\Seeder;

class ShipContainerSupportSeeder extends Seeder
{
    /**
     * Ensure every customer has a couple of project owners (Client Name
     * sources) and CFS project locations exist for the allocation dropdown.
     */
    public function run(): void
    {
        // CFS project locations for the Allocation dropdown
        $locations = [
            ['name' => 'CFS Mombasa Bulk', 'description' => 'Bulk container freight station, Mombasa'],
            ['name' => 'CFS Nairobi ICD', 'description' => 'Inland container depot freight station, Nairobi'],
            ['name' => 'CFS Nanyuki Road', 'description' => 'Nanyuki Road freight station'],
            ['name' => 'RORO Yard, Mombasa', 'description' => 'Roll-on/roll-off unit yard'],
            ['name' => 'Bonded Warehouse 1', 'description' => 'Bonded storage facility A'],
            ['name' => 'Bonded Warehouse 2', 'description' => 'Bonded storage facility B'],
        ];

        foreach ($locations as $location) {
            ProjectLocation::firstOrCreate(
                ['name' => $location['name']],
                $location + ['created_by' => 1]
            );
        }

        // A couple of project owners per customer for the Client Name dropdown
        $ownersByCustomer = [
            'ABC Manufacturing Ltd' => [
                ['name' => 'ABC Industrial Division', 'email' => 'industrial@abc-owners.test'],
                ['name' => 'ABC Procurement Unit', 'email' => 'procurement@abc-owners.test'],
            ],
            'Highland Coffee Growers' => [
                ['name' => 'Highland Export Desk', 'email' => 'export@highland-owners.test'],
                ['name' => 'Highland Estates Office', 'email' => 'estates@highland-owners.test'],
            ],
            'Coast Logistics Services' => [
                ['name' => 'Coast Bonded Haulage', 'email' => 'haulage@coast-owners.test'],
                ['name' => 'Coast Clearing Desk', 'email' => 'clearing@coast-owners.test'],
            ],
        ];

        foreach ($ownersByCustomer as $customerName => $owners) {
            $customer = Customer::where('name', $customerName)->first();
            if (! $customer) {
                continue;
            }

            foreach ($owners as $owner) {
                ProjectOwner::firstOrCreate(
                    ['name' => $owner['name']],
                    $owner + [
                        'customer_id' => $customer->id,
                        'created_by' => 1,
                    ]
                );
            }
        }
    }
}
