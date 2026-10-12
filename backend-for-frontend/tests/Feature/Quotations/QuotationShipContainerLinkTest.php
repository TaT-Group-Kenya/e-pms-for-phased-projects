<?php

namespace Tests\Feature\Quotations;

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
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class QuotationShipContainerLinkTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private Customer $customer;

    private ProjectOwner $owner;

    private ShipContainer $container;

    private ProjectLocation $cfs;

    protected function setUp(): void
    {
        parent::setUp();

        config(['app.key' => 'base64:'.base64_encode(random_bytes(32))]);

        $this->admin = User::create([
            'email' => 'quote-admin@example.com',
            'first_name' => 'Quote',
            'last_name' => 'Admin',
            'password' => bcrypt('password123'),
            'category' => 'internal',
            'is_active' => true,
        ]);

        SysRole::create(['name' => 'ROLE_ADD_QUOTATION', 'description' => 'add quote']);
        SysRole::create(['name' => 'ROLE_EDIT_QUOTATION', 'description' => 'edit quote']);
        SysRole::create(['name' => 'ROLE_VIEW_QUOTATION', 'description' => 'view quote']);
        SysRole::create(['name' => 'ROLE_ADD_ORDER', 'description' => 'add order']);
        SysRole::create(['name' => 'ROLE_ADD_QUOTE_LINE_ITEM', 'description' => 'add line item']);

        $group = SysGroup::create(['name' => 'Quote Admins', 'description' => null]);
        UserGroup::create(['user_id' => $this->admin->id, 'sys_group_id' => $group->id]);
        foreach (['ROLE_ADD_QUOTATION', 'ROLE_EDIT_QUOTATION', 'ROLE_VIEW_QUOTATION', 'ROLE_ADD_ORDER', 'ROLE_ADD_QUOTE_LINE_ITEM'] as $roleName) {
            GroupRole::create(['group_id' => $group->id, 'role_id' => SysRole::where('name', $roleName)->first()->id]);
        }

        foreach ([
            'SHIP_CONTAINER_REFERENCE_PREFIX' => 'SHC-',
            'SHIP_CONTAINER_REFERENCE_INCREMENT' => '1',
            'SHIP_CONTAINER_REFERENCE_LENGTH' => '6',
            'QUOTATION_NUMBER_PREFIX' => 'QUO-',
            'QUOTATION_NUMBER_INCREMENT' => '1',
            'QUOTATION_NUMBER_LENGTH' => '6',
            'ORDER_NUMBER_PREFIX' => 'ORD-',
            'ORDER_NUMBER_INCREMENT' => '1',
            'ORDER_NUMBER_LENGTH' => '6',
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
            'name' => 'Highland Export Desk',
            'customer_id' => $this->customer->id,
            'created_by' => $this->admin->id,
        ]);

        $this->cfs = ProjectLocation::create([
            'name' => 'CFS Nairobi ICD',
            'created_by' => $this->admin->id,
        ]);

        $this->container = ShipContainer::create([
            'container_type' => 'container_import',
            'customer_id' => $this->customer->id,
            'project_owner_id' => $this->owner->id,
            'eta' => '2026-10-02',
            'port_in' => 'Mombasa Port',
            'bl_no' => 'BL-LINK-1',
            'quantity' => 0,
            'created_by' => $this->admin->id,
        ]);
        $this->container->numbers()->create(['container_no' => 'MSCU4801902', 'created_by' => $this->admin->id]);
        $this->container->numbers()->create(['container_no' => 'MSCU4801903', 'created_by' => $this->admin->id]);
    }

    private function authHeaders(): array
    {
        return ['Authorization' => 'Bearer '.$this->admin->createToken('tests')->plainTextToken];
    }

    private function quotePayload(array $overrides = []): array
    {
        return array_merge([
            'customer_id' => $this->customer->id,
            'project_owner_id' => $this->owner->id,
            'ship_container_id' => $this->container->id,
            'title' => 'Coffee shipment quotation',
            'status' => 'draft',
            'valid_until_date' => '2026-12-01',
            'subtotal_amount' => 1000,
            'tax_amount' => 160,
            'discount_percentage' => 0,
            'discount_amount' => 0,
            'total_amount' => 1160,
            'currency' => 'KES',
            'creationDate' => now()->toDateString(),
            'quote_items' => [
                ['description' => 'Clearing fees', 'quantity' => 1, 'unit_price' => 1000, 'total' => 1000],
            ],
        ], $overrides);
    }

    public function test_store_creates_quotation_linked_to_ship_container_and_derives_bol_number(): void
    {
        $response = $this->postJson('/e-pms/api/v1/quotations', $this->quotePayload(), $this->authHeaders());

        $response->assertStatus(201)
            ->assertJsonPath('data.ship_container_id', $this->container->id)
            ->assertJsonPath('data.client_name', 'Highland Export Desk');

        $this->assertSame(
            ['MSCU4801902', 'MSCU4801903'],
            $response->json('data.ship_container_numbers')
        );

        // bol_number derived from the linked container's single BOL/BL number
        $this->assertSame('BL-LINK-1', $response->json('data.bol_number'));
    }

    public function test_store_requires_ship_container(): void
    {
        $payload = $this->quotePayload();
        unset($payload['ship_container_id']);

        $response = $this->postJson('/e-pms/api/v1/quotations', $payload, $this->authHeaders());

        $response->assertStatus(422)->assertJsonValidationErrors(['ship_container_id']);
    }

    public function test_store_rejects_stale_bol_number_payload(): void
    {
        $response = $this->postJson('/e-pms/api/v1/quotations', $this->quotePayload([
            'bol_number' => 'MANUAL-TEXT',
        ]), $this->authHeaders());

        $response->assertStatus(422)->assertJsonValidationErrors(['bol_number']);
    }

    public function test_container_must_belong_to_selected_customer_and_consignee(): void
    {
        $otherCustomer = Customer::create([
            'name' => 'Other Ltd',
            'email' => 'other@clients.test',
            'phone' => '+254700000009',
            'address' => 'Address',
            'city' => 'Nairobi',
            'country' => 'Kenya',
            'created_by' => $this->admin->id,
        ]);

        $otherOwner = ProjectOwner::create([
            'name' => 'Other Owner',
            'customer_id' => $otherCustomer->id,
            'created_by' => $this->admin->id,
        ]);

        // Consignee from another customer with this customer's container
        $response = $this->postJson('/e-pms/api/v1/quotations', $this->quotePayload([
            'project_owner_id' => $otherOwner->id,
        ]), $this->authHeaders());

        $response->assertStatus(422)->assertJsonValidationErrors(['ship_container_id']);
    }

    public function test_container_cannot_back_two_quotations(): void
    {
        $this->postJson('/e-pms/api/v1/quotations', $this->quotePayload(), $this->authHeaders())
            ->assertStatus(201);

        $response = $this->postJson('/e-pms/api/v1/quotations', $this->quotePayload([
            'title' => 'Second quotation',
        ]), $this->authHeaders());

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['ship_container_id'])
            ->assertJsonFragment([
                'ship_container_id' => ['This ship container entry is already linked to another quotation (1 quote per container).'],
            ]);
    }

    public function test_update_container_linkage_keeps_bol_number_in_sync(): void
    {
        $response = $this->postJson('/e-pms/api/v1/quotations', $this->quotePayload(), $this->authHeaders());
        $quotationId = $response->json('data.id');
        $secondContainer = ShipContainer::create([
            'container_type' => 'container_import',
            'customer_id' => $this->customer->id,
            'project_owner_id' => $this->owner->id,
            'eta' => '2026-10-20',
            'port_in' => 'Lamu Port',
            'bl_no' => 'BL-LINK-2',
            'quantity' => 0,
            'created_by' => $this->admin->id,
        ]);
        $secondContainer->numbers()->create(['container_no' => 'NEWU1111111', 'created_by' => $this->admin->id]);
        Log::debug('QSC_TEST_UPDATE', [
            'quotation_id' => $quotationId,
            'second_container_id' => $secondContainer->id,
            'second_container_customer' => $secondContainer->customer_id,
            'second_container_owner' => $secondContainer->project_owner_id,
        ]);

        Log::debug('QSC_TEST_PUT_PAYLOAD', ['url' => "/e-pms/api/v1/quotations/{$quotationId}", 'payload' => ['ship_container_id' => $secondContainer->id]]);

        $update = $this->putJson("/e-pms/api/v1/quotations/{$quotationId}", [
            'ship_container_id' => $secondContainer->id,
        ], $this->authHeaders());

        Log::debug('QSC_TEST_PUT_RESULT', [
            'status' => $update->status(),
            'ship_container_id' => $update->json('data.ship_container_id'),
            'bol_number' => $update->json('data.bol_number'),
            'response_client' => json_encode($update->json('errors') ?? $update->json('message')),
        ]);

        $update->assertStatus(200)
            ->assertJsonPath('data.ship_container_id', $secondContainer->id)
            ->assertJsonPath('data.bol_number', 'BL-LINK-2');
    }

    public function test_status_transition_on_linked_quotation_does_not_violate_the_container_unique_rule(): void
    {
        // Create a quotation linked to the container (already linked -> itself),
        // with a line item so the sent-status business rule is satisfied.
        $response = $this->postJson('/e-pms/api/v1/quotations', $this->quotePayload(), $this->authHeaders());
        $quotationId = $response->json('data.id');

        $this->postJson('/e-pms/api/v1/quote-line-items', [
            'quotation_id' => $quotationId,
            'item_name' => 'Clearing fees',
            'quoted_amount' => 1000,
            'quantity' => 1,
            'is_taxable' => false,
        ], $this->authHeaders())->assertStatus(201);

        // "Mark as sent": a status-only PUT must not trip the 1:1 rule against itself
        $this->putJson("/e-pms/api/v1/quotations/{$quotationId}", ['status' => 'sent'], $this->authHeaders())
            ->assertStatus(200)
            ->assertJsonPath('data.status', 'sent')
            ->assertJsonPath('data.ship_container_id', $this->container->id);
    }

    public function test_update_with_container_and_status_sent_requires_line_items_added_separately(): void
    {
        $response = $this->postJson('/e-pms/api/v1/quotations', $this->quotePayload(), $this->authHeaders());
        $quotationId = $response->json('data.id');

        // Line items are added through the dedicated endpoint while in draft
        $this->postJson('/e-pms/api/v1/quote-line-items', [
            'quotation_id' => $quotationId,
            'item_name' => 'Clearing fees',
            'quoted_amount' => 1000,
            'quantity' => 1,
            'is_taxable' => false,
        ], $this->authHeaders())->assertStatus(201);

        $this->putJson("/e-pms/api/v1/quotations/{$quotationId}", [
            'status' => 'sent',
            'ship_container_id' => $this->container->id,
        ], $this->authHeaders())
            ->assertStatus(200)
            ->assertJsonPath('data.status', 'sent');
    }

    public function test_order_generated_from_quotation_carries_container_linkage(): void
    {
        $response = $this->postJson('/e-pms/api/v1/quotations', $this->quotePayload([
            'status' => 'approved',
        ]), $this->authHeaders());
        $quotationId = $response->json('data.id');

        $order = $this->postJson('/e-pms/api/v1/orders/generate-from-quotation', [
            'quotation_id' => $quotationId,
        ], $this->authHeaders());

        $order->assertStatus(201)
            ->assertJsonPath('data.ship_container_id', $this->container->id)
            ->assertJsonPath('data.bol_number', 'BL-LINK-1');
    }
}
