<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\ProjectLocation;
use App\Models\ProjectOwner;
use App\Models\ShipContainer;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ShipContainerSeeder extends Seeder
{
    /**
     * Create three fully-populated demo records for every container type
     * (15 total), only when no ship container entries already exist.
     *
     * The Client Name is the project owner belonging to the linked customer
     * (project_owner_id — required); foreign consignees have no linked
     * customer. Container numbers are tracked per entry and the quantity
     * equals the count of numbers. Client names are fictional and never
     * reuse platform customer names.
     */
    public function run(): void
    {
        if (ShipContainer::withDeleted()->exists()) {
            $this->command?->info('Ship containers already exist; skipping demo seeding.');

            return;
        }

        $admin = User::where('email', 'admin@example.com')->first()
            ?? User::first();
        $adminId = $admin?->id ?? 1;

        // Reference numbering reads the prefix/increment/length sys-configs;
        // ensure they exist so seeding works on a fresh environment.
        foreach ([
            'SHIP_CONTAINER_REFERENCE_PREFIX' => 'SHC-',
            'SHIP_CONTAINER_REFERENCE_INCREMENT' => '1',
            'SHIP_CONTAINER_REFERENCE_LENGTH' => '6',
        ] as $name => $value) {
            DB::table('sys_configs')->updateOrInsert(
                ['name' => $name],
                ['value' => $value, 'readonly' => true, 'is_deleted' => false]
            );
        }

        $customerIds = Customer::pluck('id', 'name')->all();
        $customerId = fn (string $name) => $customerIds[$name] ?? null;

        // Project owners grouped by their customer name
        $ownerIds = [];
        foreach (ProjectOwner::withDeleted()->get() as $owner) {
            $customerName = $owner->customer?->name;
            if ($customerName) {
                $ownerIds[$customerName][] = $owner->id;
            }
        }
        $ownerId = function (string $customerName, int $offset = 0) use ($ownerIds) {
            $list = $ownerIds[$customerName] ?? [];

            return $list[$offset % max(1, count($list))] ?? $list[0] ?? null;
        };

        $locationIds = ProjectLocation::pluck('id')->all();
        $locationId = fn () => $locationIds ? $locationIds[array_rand($locationIds)] : null;

        $prefix = (string) DB::table('sys_configs')->where('name', 'SHIP_CONTAINER_REFERENCE_PREFIX')->value('value');
        $length = max(1, (int) DB::table('sys_configs')->where('name', 'SHIP_CONTAINER_REFERENCE_LENGTH')->value('value'));

        $rows = [];
        $index = 0;

        $push = function (array $attributes) use (&$rows, &$index, $adminId): void {
            $index++;
            $attributes['_seq'] = $index;
            $rows[] = array_merge($attributes, [
                'created_by' => $adminId,
                'created_at' => Carbon::now()->subDays(15 - $index),
                'updated_by' => $adminId,
                'updated_at' => Carbon::now()->subDays(15 - $index),
                'is_deleted' => false,
            ]);
        };

        /*
         * ------------------------------------------------------------------
         * Imports Container (3)
         * ------------------------------------------------------------------
         */
        $push([
            'container_type' => ShipContainer::TYPE_CONTAINER_IMPORT,
            'customer_id' => $customerId('ABC Manufacturing Ltd'),
            'project_owner_id' => $ownerId('ABC Manufacturing Ltd'),
            'eta' => '2026-09-28',
            'port_in' => 'Mombasa Port',
            'get_in' => '2026-09-28 06:15:00',
            'bl_no' => 'MAEU221098345',
            '_numbers' => [
                [
                    'container_no' => 'MSCU4801902',
                    'size' => 40,
                    'size_unit' => 'feet',
                    'goods_description' => 'Industrial machine parts in wooden crates',
                    'entry_number' => 'IM/2026/10421',
                ],
                [
                    'container_no' => 'MSCU4801903',
                    'size' => 40,
                    'size_unit' => 'feet',
                    'goods_description' => 'Industrial machine parts in wooden crates',
                    'entry_number' => 'IM/2026/10422',
                ],
                [
                    'container_no' => 'MSCU4801904',
                    'size' => 20,
                    'size_unit' => 'feet',
                    'goods_description' => 'Replacement control panels',
                    'entry_number' => 'IM/2026/10423',
                ],
            ],
            'description' => 'Industrial machine parts in wooden crates',
            'entry_status' => 'registered',
            'person_incharge' => 'Joseph Maina',
            'shipping_line' => 'MSC',
            'do_status' => 'pending_invoice',
            'allocation' => $locationId(),
            'guarantee_status' => 'Received',
            'gt_expiry_date' => '2026-12-31',
            'empty_status' => 'loaded',
        ]);

        $push([
            'container_type' => ShipContainer::TYPE_CONTAINER_IMPORT,
            'customer_id' => $customerId('Highland Coffee Growers'),
            'project_owner_id' => $ownerId('Highland Coffee Growers'),
            'eta' => '2026-10-06',
            'port_in' => 'Mombasa Port',
            'get_in' => '2026-10-06 09:50:00',
            'bl_no' => 'HLCU773451208',
            '_numbers' => ['HLXU2077634', 'HLXU2077635'],
            'description' => 'Packaging materials and spare filters',
            'entry_status' => 'released',
            'person_incharge' => 'Grace Wambui',
            'shipping_line' => 'Maersk',
            'do_status' => 'under_process',
            'allocation' => $locationId(),
            'guarantee_status' => 'Received',
            'empty_status' => 'not_loaded_out',
        ]);

        $push([
            'container_type' => ShipContainer::TYPE_CONTAINER_IMPORT,
            'customer_id' => $customerId('Coast Logistics Services'),
            'project_owner_id' => $ownerId('Coast Logistics Services'),
            'eta' => '2026-10-09',
            'port_in' => 'Jomo Kenyatta Airport',
            'bl_no' => 'ONSH551027497',
            '_numbers' => ['ONEY5580217'],
            'description' => 'Textile rolls for garment export processing',
            'entry_status' => 'settled',
            'person_incharge' => 'Peter Otieno',
            'shipping_line' => 'ONE',
            'do_status' => 'ready',
            'allocation' => $locationId(),
            'guarantee_status' => 'Pending',
            'empty_status' => 'empty_returned',
        ]);

        /*
         * ------------------------------------------------------------------
         * Exports Container (3)
         * ------------------------------------------------------------------
         */
        $push([
            'container_type' => ShipContainer::TYPE_CONTAINER_EXPORT,
            'customer_id' => $customerId('Highland Coffee Growers'),
            'project_owner_id' => $ownerId('Highland Coffee Growers'),
            'etd' => '2026-10-14',
            'goods_description' => 'Roasted Arabica coffee in 60kg jute bags',
            '_numbers' => [
                [
                    'container_no' => 'CAIU6672103',
                    'size' => 40,
                    'size_unit' => 'feet',
                    'goods_description' => 'Roasted Arabica coffee in 60kg jute bags',
                    'entry_number' => 'EXP/2026/0917',
                ],
                [
                    'container_no' => 'CAIU6672104',
                    'size' => 40,
                    'size_unit' => 'feet',
                    'goods_description' => 'Roasted Arabica coffee in 60kg jute bags',
                    'entry_number' => 'EXP/2026/0917',
                ],
                'CAIU6672105',
                'CAIU6672106',
            ],
            'entry_number' => 'EXP/2026/0917',
            'booking_no' => 'BKNG-204-8801',
            'bl_no' => 'CMAC220046712',
            'location' => 'Nairobi ICD',
            'shipping_line' => 'CMA CGM',
            'port_out' => 'Mombasa Port',
            'get_in' => '2026-10-11 07:00:00',
            'get_out' => '2026-10-14 18:30:00',
            'coe' => 'GENERATED',
            'status' => ShipContainer::STATUS_LOADED,
        ]);

        $push([
            'container_type' => ShipContainer::TYPE_CONTAINER_EXPORT,
            'customer_id' => $customerId('ABC Manufacturing Ltd'),
            'project_owner_id' => $ownerId('ABC Manufacturing Ltd'),
            'etd' => '2026-10-18',
            'goods_description' => 'Fabricated steel components, palletised',
            '_numbers' => ['TCLU9905841'],
            'entry_number' => 'EXP/2026/0942',
            'booking_no' => 'BKNG-204-8845',
            'location' => 'Mombasa Port',
            'shipping_line' => 'Evergreen',
            'port_out' => 'Lamu Port',
            'coe' => 'PENDING',
            'status' => ShipContainer::STATUS_BOOKED,
        ]);

        $push([
            'container_type' => ShipContainer::TYPE_CONTAINER_EXPORT,
            'customer_id' => $customerId('Coast Logistics Services'),
            'project_owner_id' => $ownerId('Coast Logistics Services'),
            'etd' => '2026-10-05',
            'goods_description' => 'Avocados in refrigerated cartons',
            '_numbers' => ['MSKU1127490', 'MSKU1127491'],
            'entry_number' => 'EXP/2026/0873',
            'booking_no' => 'BKNG-204-8790',
            'location' => 'Mombasa Port',
            'shipping_line' => 'MSC',
            'port_out' => 'Mombasa Port',
            'get_in' => '2026-10-04 11:20:00',
            'get_out' => '2026-10-05 15:05:00',
            'coe' => 'GENERATED',
            'status' => ShipContainer::STATUS_SAILED,
        ]);

        /*
         * ------------------------------------------------------------------
         * Transit Container (3)
         * ------------------------------------------------------------------
         */
        $push([
            'container_type' => ShipContainer::TYPE_CONTAINER_TRANSIT,
            'customer_id' => $customerId('Coast Logistics Services'),
            'project_owner_id' => $ownerId('Coast Logistics Services'),
            'eta' => '2026-10-01',
            'port_in' => 'Mombasa Port',
            'port_out' => 'Malaba Border',
            'get_in' => '2026-10-02 05:40:00',
            'last_free_day' => '2026-10-12',
            'cfs' => $locationId(),
            '_numbers' => [
                [
                    'container_no' => 'TRANS7734108',
                    'size' => 40,
                    'size_unit' => 'feet',
                    'goods_description' => 'Bonded solar panels',
                    'entry_number' => 'TR/10/2026/00814',
                ],
                [
                    'container_no' => 'TRANS7734109',
                    'size' => 40,
                    'size_unit' => 'feet',
                    'goods_description' => 'Bonded solar panels',
                    'entry_number' => 'TR/10/2026/00814',
                ],
            ],
            'description' => 'Bonded solar panels bound for Kampala',
            'tr10_entry_status' => 'registered',
            'tr12_entry_status' => 't1',
            'shipping_agent' => 'Siginon Transits',
            'do_status' => 'invoice_generated',
            'allocation' => $locationId(),
            'destination' => 'Kampala, Uganda',
            'gt_expiration_date' => '2026-11-30',
            'empty_status' => 'loaded',
        ]);

        $push([
            'container_type' => ShipContainer::TYPE_CONTAINER_TRANSIT,
            'client_name' => 'Mirembe Relief Logistics',
            'customer_id' => $customerId('Highland Coffee Growers'),
            'project_owner_id' => $ownerId('Highland Coffee Growers'),
            'eta' => '2026-09-16',
            'port_in' => 'Mombasa Port',
            'port_out' => 'Namanga Border',
            'get_in' => '2026-09-17 08:05:00',
            'last_free_day' => '2026-09-27',
            'cfs' => $locationId(),
            '_numbers' => ['TEMU4471206'],
            'description' => 'Medical supplies and tents for South Sudan',
            'tr10_entry_status' => 'released',
            'tr12_entry_status' => 'settled',
            'shipping_agent' => 'Boliib Global',
            'do_status' => 'pending_payment',
            'allocation' => $locationId(),
            'destination' => 'Juba, South Sudan',
            'gt_expiration_date' => '2026-11-15',
            'empty_status' => 'loaded',
        ]);

        $push([
            'container_type' => ShipContainer::TYPE_CONTAINER_TRANSIT,
            'client_name' => 'Ruvuma Freight Corridor',
            'customer_id' => $customerId('ABC Manufacturing Ltd'),
            'project_owner_id' => $ownerId('ABC Manufacturing Ltd'),
            'eta' => '2026-09-08',
            'port_in' => 'Lamu Port',
            'port_out' => 'Malaba Border',
            'get_in' => '2026-09-10 10:00:00',
            'get_out' => '2026-09-24 14:30:00',
            'last_free_day' => '2026-09-20',
            'cfs' => $locationId(),
            '_numbers' => ['TGHU8867154'],
            'description' => 'Beverage concentrates for Rwanda bottling plant',
            'tr10_entry_status' => 'settled',
            'tr12_entry_status' => 'registered',
            'shipping_agent' => 'Siginon Transits',
            'do_status' => 'ready',
            'allocation' => $locationId(),
            'destination' => 'Kigali, Rwanda',
            'gt_expiration_date' => '2026-10-31',
            'empty_status' => 'empty_returned',
            'exit_date' => '2026-09-24 14:30:00',
            'exit_border' => 'Malaba',
            'exit_remarks' => 'Escorted convoy 14B, cleared at Malaba OSBP',
        ]);

        /*
         * ------------------------------------------------------------------
         * Transit Unit (3)
         * ------------------------------------------------------------------
         */
        $push([
            'container_type' => ShipContainer::TYPE_UNIT_TRANSIT,
            'customer_id' => $customerId('Coast Logistics Services'),
            'project_owner_id' => $ownerId('Coast Logistics Services'),
            'eta' => '2026-10-04',
            'port_in' => 'Mombasa RORO',
            'port_out' => 'Malaba Border',
            'get_in' => '2026-10-05 12:30:00',
            'vessel' => 'MV Kota Nabil',
            '_numbers' => [[
                'container_no' => 'UTR-RO-RO-1182',
                'size' => 12,
                'size_unit' => 'm',
                'goods_description' => 'Heavy excavator on low-loader trailer',
                'entry_number' => 'UNIT/2026/0468',
            ]],
            'description' => 'Heavy excavator on low-loader trailer',
            'chassis_no' => 'CHS-TR-889124',
            'remarks' => 'Out-of-gauge cargo; escort vehicle required',
            'registration_no' => 'UT TRACTOR 5521',
            'cfs' => $locationId(),
            'bol_no' => 'TRBOL-2026-0468',
            'shipping_line' => 'Siginon Transits',
            'station' => 'Mombasa RORO',
        ]);

        $push([
            'container_type' => ShipContainer::TYPE_UNIT_TRANSIT,
            'customer_id' => $customerId('Highland Coffee Growers'),
            'project_owner_id' => $ownerId('Highland Coffee Growers'),
            'eta' => '2026-09-19',
            'port_in' => 'Mombasa RORO',
            'port_out' => 'Busia Border',
            'get_in' => '2026-09-20 07:45:00',
            'vessel' => 'MV Mol Motivator',
            '_numbers' => ['UTR-TRK-4410', 'UTR-TRK-4411', 'UTR-TRK-4412'],
            'description' => 'Water bowsers for humanitarian mission',
            'chassis_no' => 'CHS-TR-903551',
            'remarks' => 'Multi-unit convoy travelling together',
            'registration_no' => 'UT TRACTOR 6574',
            'cfs' => $locationId(),
            'bol_no' => 'TRBOL-2026-0412',
            'shipping_line' => 'Mol',
            'station' => 'Nairobi ICD',
        ]);

        $push([
            'container_type' => ShipContainer::TYPE_UNIT_TRANSIT,
            'customer_id' => $customerId('ABC Manufacturing Ltd'),
            'project_owner_id' => $ownerId('ABC Manufacturing Ltd'),
            'eta' => '2026-09-02',
            'port_in' => 'Mombasa RORO',
            'port_out' => 'Malaba Border',
            'get_in' => '2026-09-03 09:10:00',
            'get_out' => '2026-09-21 09:45:00',
            'vessel' => 'MV Kota Nabil',
            '_numbers' => ['UTR-TRK-3891'],
            'description' => 'Forklifts bound for industrial zone, Kigali',
            'chassis_no' => 'CHS-TR-771208',
            'remarks' => 'Self-propelling units; driven off at exit',
            'registration_no' => 'UT TRACTOR 4810',
            'cfs' => $locationId(),
            'bol_no' => 'TRBOL-2026-0361',
            'shipping_line' => 'Siginon Transits',
            'exit_date' => '2026-09-21 09:45:00',
            'exit_border' => 'Busia',
            'exit_remarks' => 'Drove off under escort at Busia OSBP',
            'station' => 'Busia Border',
        ]);

        /*
         * ------------------------------------------------------------------
         * Import Unit (3)
         * ------------------------------------------------------------------
         */
        $push([
            'container_type' => ShipContainer::TYPE_UNIT_IMPORT,
            'customer_id' => $customerId('ABC Manufacturing Ltd'),
            'project_owner_id' => $ownerId('ABC Manufacturing Ltd'),
            'eta' => '2026-10-03',
            'port_in' => 'Mombasa Port',
            'get_in' => '2026-10-04 13:20:00',
            '_numbers' => ['IMU-GN-7723'],
            'description' => 'Generator set 500 kVA, self-propelled mount',
            'registration_no' => 'IMU UNIT 2210',
            'bl_no' => 'IMBL-2026-0917',
            'entry_status' => 'registered',
            'shipping_line' => 'Grimaldi',
            'allocation' => $locationId(),
            'remarks' => 'Delivered directly from port after customs release, no storage incurred.',
        ]);

        $push([
            'container_type' => ShipContainer::TYPE_UNIT_IMPORT,
            'customer_id' => $customerId('Coast Logistics Services'),
            'project_owner_id' => $ownerId('Coast Logistics Services'),
            'eta' => '2026-09-24',
            'port_in' => 'Eldoret Airport',
            'get_in' => '2026-09-25 16:00:00',
            '_numbers' => ['IMU-TR-9938'],
            'description' => 'Mobile crane 120t, fleet replacement unit',
            'registration_no' => 'IMU UNIT 3345',
            'bl_no' => 'IMBL-2026-0881',
            'entry_status' => 'released',
            'shipping_line' => 'Hoegh Autoliners',
            'allocation' => $locationId(),
            'remarks' => 'Awaiting duty assessment before release; valuation submitted.',
        ]);

        $push([
            'container_type' => ShipContainer::TYPE_UNIT_IMPORT,
            'customer_id' => $customerId('Highland Coffee Growers'),
            'project_owner_id' => $ownerId('Highland Coffee Growers'),
            'eta' => '2026-09-11',
            'port_in' => 'Mombasa Port',
            'get_in' => '2026-09-12 08:55:00',
            '_numbers' => ['IMU-TR-1129', 'IMU-TR-1130'],
            'description' => 'Tractor with implements for estate operations',
            'registration_no' => 'IMU UNIT 4452',
            'bl_no' => 'IMBL-2026-0802',
            'entry_status' => 'settled',
            'shipping_line' => 'Grimaldi',
            'allocation' => $locationId(),
            'remarks' => 'Two units, arrived together on the same vessel.',
        ]);

        foreach ($rows as $row) {
            $seq = $row['_seq'];
            unset($row['_seq']);
            $numbers = $row['_numbers'];
            unset($row['_numbers']);

            $container = ShipContainer::create(array_merge($row, [
                'reference_number' => $prefix.str_pad((string) $seq, $length, '0', STR_PAD_LEFT),
                // quantity always equals the tracked container numbers
                'quantity' => count($numbers),
            ]));

            foreach ($numbers as $number) {
                $number = is_string($number) ? ['container_no' => $number] : $number;
                $container->numbers()->create([
                    'container_no' => $number['container_no'],
                    'size' => $number['size'] ?? null,
                    'size_unit' => $number['size_unit'] ?? 'feet',
                    'goods_description' => $number['goods_description'] ?? null,
                    'entry_number' => $number['entry_number'] ?? null,
                    'created_by' => $adminId,
                ]);
            }
        }

        $this->command?->info('Seeded '.count($rows).' ship containers (3 per container type).');
    }
}
