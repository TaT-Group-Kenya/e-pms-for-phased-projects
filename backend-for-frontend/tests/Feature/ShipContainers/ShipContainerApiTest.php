<?php

namespace Tests\Feature\ShipContainers;

use App\Models\Customer;
use App\Models\GroupRole;
use App\Models\ProjectLocation;
use App\Models\ProjectOwner;
use App\Models\ShipContainer;
use App\Models\SysConfig;
use App\Models\SysGroup;
use App\Models\SysRole;
use App\Models\User;
use App\Models\UserGroup;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShipContainerApiTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private Customer $customer;

    private ProjectOwner $owner;

    private ProjectLocation $location;

    protected function setUp(): void
    {
        parent::setUp();

        config(['app.key' => 'base64:'.base64_encode(random_bytes(32))]);

        foreach (['ADD', 'EDIT', 'DELETE', 'VIEW'] as $action) {
            SysRole::create(['name' => "ROLE_{$action}_SHIP_CONTAINER", 'description' => strtolower($action)]);
        }

        $group = SysGroup::create(['name' => 'Administrators', 'description' => null]);

        $this->admin = User::create([
            'email' => 'container-admin@example.com',
            'first_name' => 'Ship',
            'last_name' => 'Admin',
            'password' => bcrypt('password123'),
            'category' => 'internal',
            'is_active' => true,
        ]);

        UserGroup::create(['user_id' => $this->admin->id, 'sys_group_id' => $group->id]);

        SysRole::whereIn('name', [
            'ROLE_ADD_SHIP_CONTAINER',
            'ROLE_EDIT_SHIP_CONTAINER',
            'ROLE_DELETE_SHIP_CONTAINER',
            'ROLE_VIEW_SHIP_CONTAINER',
        ])->get()->each(fn ($role) => GroupRole::create([
            'group_id' => $group->id,
            'role_id' => $role->id,
        ]));

        foreach ([
            'SHIP_CONTAINER_REFERENCE_PREFIX' => 'SHC-',
            'SHIP_CONTAINER_REFERENCE_INCREMENT' => '1',
            'SHIP_CONTAINER_REFERENCE_LENGTH' => '6',
            'SHIP_CONTAINER_TRANSIT_EXIT_DAYS' => '30',
            'SHIP_CONTAINER_TRANSIT_NOTIFY_DAY' => '25',
        ] as $name => $value) {
            SysConfig::create(['name' => $name, 'value' => $value, 'readonly' => false]);
        }

        $this->customer = Customer::create([
            'name' => 'Highland Coffee Growers',
            'email' => 'highland@clients.test',
            'phone' => '+254700000001',
            'address' => 'Nanyuki Road',
            'city' => 'Nanyuki',
            'country' => 'Kenya',
            'created_by' => $this->admin->id,
        ]);

        $this->owner = ProjectOwner::create([
            'name' => 'Tanridge Foods International',
            'customer_id' => $this->customer->id,
            'created_by' => $this->admin->id,
        ]);

        $this->location = ProjectLocation::create([
            'name' => 'CFS Mombasa Bulk',
            'created_by' => $this->admin->id,
        ]);
    }

    private function authHeaders(): array
    {
        $token = $this->admin->createToken('tests')->plainTextToken;

        return ['Authorization' => 'Bearer '.$token];
    }

    public function test_requires_authentication(): void
    {
        $this->getJson('/e-pms/api/v1/ship-containers')->assertStatus(401);
    }

    public function test_store_creates_import_container_with_numbers_and_reference(): void
    {
        $payload = [
            'container_type' => 'container_import',
            'project_owner_id' => $this->owner->id,
            'customer_id' => $this->customer->id,
            'eta' => '2026-10-02',
            'port_in' => 'Mombasa Port',
            'get_in' => '2026-10-03T09:30',
            'bl_no' => 'BL-1001',
            'container_numbers' => ['MSCU1234567', 'mscu7654321'],
            'entry_status' => 'registered',
            'shipping_line' => 'MSC',
            'do_status' => 'under_process',
            'allocation' => $this->location->id,
            'empty_status' => 'loaded',
        ];

        $response = $this->postJson('/e-pms/api/v1/ship-containers', $payload, $this->authHeaders());

        $response->assertStatus(201)
            ->assertJsonPath('data.quantity', 2)
            ->assertJsonPath('data.customer.name', 'Highland Coffee Growers')
            ->assertJsonPath('data.project_owner.name', 'Tanridge Foods International');

        $this->assertMatchesRegularExpression('/^SHC-\d{6}$/', (string) $response->json('data.reference_number'));

        $container = ShipContainer::find($response->json('data.id'));
        $this->assertSame(['MSCU1234567', 'MSCU7654321'], $container->numbers->pluck('container_no')->all());
        $this->assertSame(2.0, (float) $container->quantity);
        $this->assertSame((string) $this->location->id, (string) $container->allocation);
        $this->assertSame('registered', $container->entry_status);
        $this->assertSame('under_process', $container->do_status);
        $this->assertSame('loaded', $container->empty_status);
    }

    public function test_store_validates_required_fields_per_type(): void
    {
        $response = $this->postJson('/e-pms/api/v1/ship-containers', [
            'container_type' => 'container_import',
            'customer_id' => $this->customer->id,
            // missing project_owner_id, bl_no, shipping_line, eta, container_numbers
        ], $this->authHeaders());

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['project_owner_id', 'bl_no', 'shipping_line', 'eta', 'container_numbers']);
    }

    public function test_store_validates_container_type(): void
    {
        $response = $this->postJson('/e-pms/api/v1/ship-containers', [
            'container_type' => 'air_cargo',
            'client_name' => 'X',
        ], $this->authHeaders());

        $response->assertStatus(422)->assertJsonValidationErrors(['container_type']);
    }

    public function test_store_transit_requires_agent_and_destination(): void
    {
        $response = $this->postJson('/e-pms/api/v1/ship-containers', [
            'container_type' => 'container_transit',
            'customer_id' => $this->customer->id,
            'project_owner_id' => $this->owner->id,
            'eta' => '2026-10-01',
            'bol_no' => 'BOL-7',
            'container_numbers' => ['TGHU9876543'],
        ], $this->authHeaders());

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['shipping_agent', 'destination']);
    }

    public function test_project_owner_must_belong_to_linked_customer(): void
    {
        $otherCustomer = Customer::create([
            'name' => 'Other Customer Ltd',
            'email' => 'other@clients.test',
            'phone' => '+254700000009',
            'address' => 'Road',
            'city' => 'City',
            'country' => 'Kenya',
            'created_by' => $this->admin->id,
        ]);

        $otherOwner = ProjectOwner::create([
            'name' => 'Other Owner',
            'customer_id' => $otherCustomer->id,
            'created_by' => $this->admin->id,
        ]);

        $response = $this->postJson('/e-pms/api/v1/ship-containers', [
            'container_type' => 'container_import',
            'customer_id' => $this->customer->id,
            'project_owner_id' => $otherOwner->id, // belongs to another customer
            'eta' => '2026-10-02',
            'bl_no' => 'BL-X',
            'container_numbers' => ['XU1'],
            'shipping_line' => 'MSC',
        ], $this->authHeaders());

        $response->assertStatus(422)->assertJsonValidationErrors(['project_owner_id']);
    }

    public function test_quantity_must_not_be_sent_and_is_derived(): void
    {
        $response = $this->postJson('/e-pms/api/v1/ship-containers', [
            'container_type' => 'container_import',
            'customer_id' => $this->customer->id,
            'project_owner_id' => $this->owner->id,
            'eta' => '2026-10-02',
            'bl_no' => 'BL-Q',
            'container_numbers' => ['A1', 'B2', 'C3'],
            'quantity' => 99, // rejected: derived
            'shipping_line' => 'MSC',
        ], $this->authHeaders());

        $response->assertStatus(422)->assertJsonValidationErrors(['quantity']);
    }

    public function test_duplicate_numbers_within_entry_are_rejected_and_search_finds_secondary_numbers(): void
    {
        ShipContainer::create([
            'container_type' => 'container_import',
            'customer_id' => $this->customer->id,
            'project_owner_id' => $this->owner->id,
            'eta' => '2026-10-02',
            'bl_no' => 'BL-SEARCH',
            'shipping_line' => 'MSC',
            'created_by' => $this->admin->id,
        ]);

        $response = $this->postJson('/e-pms/api/v1/ship-containers', [
            'container_type' => 'container_import',
            'customer_id' => $this->customer->id,
            'project_owner_id' => $this->owner->id,
            'eta' => '2026-10-02',
            'bl_no' => 'BL-SEARCH2',
            'container_numbers' => ['TSTU9009001', 'TSTU9009001'],
            'shipping_line' => 'MSC',
        ], $this->authHeaders());

        $response->assertStatus(422)->assertJsonValidationErrors(['container_numbers.1']);

        // Secondary number is searchable
        $container = ShipContainer::first();
        $container->numbers()->create(['container_no' => 'TSTU8888222', 'created_by' => $this->admin->id]);

        $found = $this->getJson('/e-pms/api/v1/ship-containers?search=tstu8888', $this->authHeaders());
        $this->assertSame(1, count($found->json('data')));
    }

    public function test_index_filters_by_type_and_status(): void
    {
        ShipContainer::create([
            'container_type' => 'container_import',
            'customer_id' => $this->customer->id,
            'project_owner_id' => $this->owner->id,
            'bl_no' => 'BL-A',
            'shipping_line' => 'MSC',
            'quantity' => 1,
            'created_by' => $this->admin->id,
        ]);
        ShipContainer::create([
            'container_type' => 'container_transit',
            'customer_id' => $this->customer->id,
            'project_owner_id' => $this->owner->id,
            'bol_no' => 'BOL-A',
            'shipping_agent' => 'Agent',
            'destination' => 'Kampala',
            'quantity' => 1,
            'status' => 'cleared',
            'created_by' => $this->admin->id,
        ]);

        $response = $this->getJson('/e-pms/api/v1/ship-containers?container_type=container_transit&status=cleared', $this->authHeaders());
        $response->assertStatus(200);
        $rows = $response->json('data');
        $this->assertSame(1, count($rows));
        $this->assertSame('container_transit', $rows[0]['container_type']);
    }

    public function test_show_returns_computed_transit_information(): void
    {
        $container = ShipContainer::create([
            'container_type' => 'container_transit',
            'customer_id' => $this->customer->id,
            'project_owner_id' => $this->owner->id,
            'eta' => now()->toDateString(),
            'get_in' => now()->format('Y-m-d\TH:i'),
            'bol_no' => 'BOL-DEADLINE',
            'shipping_agent' => 'Agent A',
            'destination' => 'Kampala',
            'port_in' => 'Mombasa Port',
            'quantity' => 1,
            'created_by' => $this->admin->id,
        ]);
        $container->numbers()->create(['container_no' => 'TRXDEAD1', 'created_by' => $this->admin->id]);

        $response = $this->getJson("/e-pms/api/v1/ship-containers/{$container->id}", $this->authHeaders());

        $response->assertStatus(200);
        $transit = $response->json('data.transit');
        $this->assertSame(30, $transit['exit_days']);
        $this->assertSame(0, $transit['day_number']);
        $this->assertSame(30, $transit['days_remaining']);
        $this->assertFalse($transit['needs_notification']);
        $this->assertCount(20, $response->json('data.type_fields'));
        $this->assertSame(['TRXDEAD1'], $response->json('data.container_numbers'));
    }

    public function test_update_modifies_fields_numbers_recompute_but_type_fixed(): void
    {
        $container = ShipContainer::create([
            'container_type' => 'container_import',
            'customer_id' => $this->customer->id,
            'project_owner_id' => $this->owner->id,
            'bl_no' => 'BL-UPD',
            'shipping_line' => 'MSC',
            'entry_status' => 'registered',
            'quantity' => 1,
            'created_by' => $this->admin->id,
        ]);
        $container->numbers()->create(['container_no' => 'OLDNUM0001', 'created_by' => $this->admin->id]);

        $response = $this->putJson("/e-pms/api/v1/ship-containers/{$container->id}", [
            'container_type' => 'container_export', // must be ignored
            'entry_status' => 'settled',
            'container_numbers' => ['NEWNUM0001', 'NEWNUM0002', 'NEWNUM0003'],
        ], $this->authHeaders());

        $response->assertStatus(200)
            ->assertJsonPath('data.entry_status', 'settled')
            ->assertJsonPath('data.container_type', 'container_import')
            ->assertJsonPath('data.quantity', 3);

        $this->assertSame(
            ['NEWNUM0001', 'NEWNUM0002', 'NEWNUM0003'],
            $container->fresh()->numbers->pluck('container_no')->all()
        );
    }

    public function test_destroy_soft_deletes(): void
    {
        $container = ShipContainer::create([
            'container_type' => 'unit_import',
            'customer_id' => $this->customer->id,
            'project_owner_id' => $this->owner->id,
            'bl_no' => 'BL-U1',
            'shipping_line' => 'SIL',
            'quantity' => 1,
            'created_by' => $this->admin->id,
        ]);

        $response = $this->deleteJson("/e-pms/api/v1/ship-containers/{$container->id}", [], $this->authHeaders());
        $response->assertStatus(204);

        $fresh = ShipContainer::withDeleted()->find($container->id);
        $this->assertTrue((bool) $fresh->is_deleted);
        $this->assertSame((int) $this->admin->id, (int) $fresh->deleted_by);
    }

    public function test_deleted_records_are_hidden_from_index(): void
    {
        $container = ShipContainer::create([
            'container_type' => 'unit_import',
            'customer_id' => $this->customer->id,
            'project_owner_id' => $this->owner->id,
            'bl_no' => 'BL-GHOST',
            'shipping_line' => 'SIL',
            'quantity' => 1,
            'created_by' => $this->admin->id,
        ]);

        $this->deleteJson("/e-pms/api/v1/ship-containers/{$container->id}", [], $this->authHeaders());

        $response = $this->getJson('/e-pms/api/v1/ship-containers?search=BL-GHOST', $this->authHeaders());
        $this->assertSame(0, count($response->json('data')));
    }

    public function test_get_in_datetime_persists_for_all_types(): void
    {
        $container = ShipContainer::create([
            'container_type' => 'unit_import',
            'customer_id' => $this->customer->id,
            'project_owner_id' => $this->owner->id,
            'bl_no' => 'BL-GETIN',
            'shipping_line' => 'SIL',
            'port_in' => 'Mombasa Port',
            'quantity' => 1,
            'created_by' => $this->admin->id,
        ]);

        $this->postJson("/e-pms/api/v1/ship-containers/{$container->id}/get-in", ['get_in' => '2026-10-05T14:45'], $this->authHeaders())
            ->assertStatus(200)
            ->assertJsonPath('data.get_in', '2026-10-05T14:45:00+00:00');

        $fresh = $container->fresh();
        $this->assertSame('2026-10-05 14:45', $fresh->get_in->format('Y-m-d H:i'));
    }

    public function test_record_exit_sets_get_out_and_rejects_before_get_in(): void
    {
        $container = ShipContainer::create([
            'container_type' => 'unit_transit',
            'customer_id' => $this->customer->id,
            'project_owner_id' => $this->owner->id,
            'container_number' => 'UNIT-GETOUT',
            'bol_no' => 'BOL-GETOUT',
            'port_in' => 'Busia',
            'get_in' => '2026-10-05T08:00',
            'quantity' => 1,
            'created_by' => $this->admin->id,
        ]);
        $container->numbers()->create(['container_no' => 'UNIT-GETOUT', 'created_by' => $this->admin->id]);

        // exit before get_in must fail
        $this->postJson("/e-pms/api/v1/ship-containers/{$container->id}/record-exit", ['exit_date' => '2026-10-05T07:00'], $this->authHeaders())
            ->assertStatus(422);

        $this->postJson("/e-pms/api/v1/ship-containers/{$container->id}/record-exit", ['exit_date' => '2026-10-08T09:30'], $this->authHeaders())
            ->assertStatus(200)
            ->assertJsonPath('data.status', 'exited');

        $fresh = $container->fresh();
        $this->assertSame('2026-10-08 09:30', $fresh->get_out->format('Y-m-d H:i'));
        $this->assertNotNull($fresh->exit_date);
    }

    public function test_record_exit_applies_only_to_transit_types(): void
    {
        $import = ShipContainer::create([
            'container_type' => 'container_import',
            'customer_id' => $this->customer->id,
            'project_owner_id' => $this->owner->id,
            'bl_no' => 'BL-EX1',
            'shipping_line' => 'MSC',
            'quantity' => 1,
            'created_by' => $this->admin->id,
        ]);

        $this->postJson("/e-pms/api/v1/ship-containers/{$import->id}/record-exit", ['exit_date' => now()->toDateString()], $this->authHeaders())
            ->assertStatus(422);
    }

    public function test_transit_notifications_lists_cargo_on_notify_day(): void
    {
        $due = ShipContainer::create([
            'container_type' => 'unit_transit',
            'customer_id' => $this->customer->id,
            'project_owner_id' => $this->owner->id,
            'container_number' => 'UNIT-DUE',
            'bol_no' => 'BOL-DUE',
            'quantity' => 1,
            'get_in' => now()->subDays(26)->toDateString().' 08:00',
            'created_by' => $this->admin->id,
        ]);
        $due->numbers()->create(['container_no' => 'UNIT-DUE', 'created_by' => $this->admin->id]);

        $notify = ShipContainer::create([
            'container_type' => 'container_transit',
            'customer_id' => $this->customer->id,
            'project_owner_id' => $this->owner->id,
            'bol_no' => 'BOL-NOTIFY',
            'shipping_agent' => 'Agent',
            'destination' => 'Kigali',
            'quantity' => 1,
            'get_in' => now()->subDays(25)->toDateString().' 08:00',
            'created_by' => $this->admin->id,
        ]);
        $notify->numbers()->create(['container_no' => 'CTR-NOTIFY', 'created_by' => $this->admin->id]);

        // fresh transit container: not yet due
        $fresh = ShipContainer::create([
            'container_type' => 'container_transit',
            'customer_id' => $this->customer->id,
            'project_owner_id' => $this->owner->id,
            'bol_no' => 'BOL-FRESH',
            'shipping_agent' => 'Agent',
            'destination' => 'Juba',
            'quantity' => 1,
            'get_in' => now()->subDays(5)->toDateString().' 08:00',
            'created_by' => $this->admin->id,
        ]);
        $fresh->numbers()->create(['container_no' => 'CTR-FRESH', 'created_by' => $this->admin->id]);

        // exited old container: never notifies
        $done = ShipContainer::create([
            'container_type' => 'container_transit',
            'customer_id' => $this->customer->id,
            'project_owner_id' => $this->owner->id,
            'bol_no' => 'BOL-DONE',
            'shipping_agent' => 'Agent',
            'destination' => 'Kampala',
            'quantity' => 1,
            'get_in' => now()->subDays(40)->toDateString().' 08:00',
            'exit_date' => now()->subDays(10),
            'created_by' => $this->admin->id,
        ]);
        $done->numbers()->create(['container_no' => 'CTR-DONE', 'created_by' => $this->admin->id]);

        $response = $this->getJson('/e-pms/api/v1/ship-containers-transit-notifications', $this->authHeaders());

        $response->assertStatus(200);
        $data = $response->json('data');

        $ids = collect($data)->pluck('id')->all();
        $this->assertContains($due->id, $ids);
        $this->assertContains($notify->id, $ids);
        $this->assertNotContains($fresh->id, $ids);
        $this->assertNotContains($done->id, $ids);
        $this->assertSame(2, $response->json('count'));
    }

    public function test_statistics_aggregates(): void
    {
        $a = ShipContainer::create([
            'container_type' => 'container_import',
            'customer_id' => $this->customer->id,
            'project_owner_id' => $this->owner->id,
            'bl_no' => 'BL-S1',
            'shipping_line' => 'MSC',
            'quantity' => 1,
            'created_by' => $this->admin->id,
        ]);
        $a->numbers()->create(['container_no' => 'S-NUM-1']);
        $b = ShipContainer::create([
            'container_type' => 'container_import',
            'customer_id' => $this->customer->id,
            'project_owner_id' => $this->owner->id,
            'bl_no' => 'BL-S2',
            'shipping_line' => 'MSC',
            'quantity' => 1,
            'created_by' => $this->admin->id,
        ]);
        $b->numbers()->create(['container_no' => 'S-NUM-2']);

        $response = $this->getJson('/e-pms/api/v1/ship-containers-statistics', $this->authHeaders());

        $response->assertStatus(200)
            ->assertJsonPath('data.total', 2);

        $stats = $response->json('data');
        $this->assertSame(2, $stats['by_type']['container_import']);
    }

    public function test_linked_customer_is_required_on_create(): void
    {
        $response = $this->postJson('/e-pms/api/v1/ship-containers', [
            'container_type' => 'unit_import',
            // customer_id + owner missing
            'eta' => '2026-10-02',
            'container_numbers' => ['IMU-1'],
            'bl_no' => 'BL-NOC',
            'shipping_line' => 'SIL',
        ], $this->authHeaders());

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['customer_id', 'project_owner_id']);
    }

    public function test_new_enum_values_accepted_and_invalid_rejected(): void
    {
        $payload = [
            'container_type' => 'container_import',
            'customer_id' => $this->customer->id,
            'project_owner_id' => $this->owner->id,
            'eta' => '2026-10-02',
            'bl_no' => 'BL-ENUM',
            'container_numbers' => ['ENUMCTR1'],
            'shipping_line' => 'MSC',
            'entry_status' => 'released',
            'do_status' => 'pending_payment',
            'empty_status' => 'empty_returned',
        ];

        $this->postJson('/e-pms/api/v1/ship-containers', $payload, $this->authHeaders())
            ->assertStatus(201);

        $bad = $payload;
        $bad['entry_status'] = 'lodged'; // retired option, must fail now
        $bad['do_status'] = 'issued';
        $bad['empty_status'] = 'laden';

        $this->postJson('/e-pms/api/v1/ship-containers', $bad, $this->authHeaders())
            ->assertStatus(422)
            ->assertJsonValidationErrors(['entry_status', 'do_status', 'empty_status']);
    }
}
