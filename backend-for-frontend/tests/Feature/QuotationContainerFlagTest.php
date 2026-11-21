<?php

namespace Tests\Feature;

use App\Models\Quotation;
use App\Models\ShipContainer;
use App\Services\QuotationService;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class QuotationContainerFlagTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Schema::dropIfExists('quotations');
        Schema::dropIfExists('ship_containers');
        Schema::dropIfExists('customers');

        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('is_deleted')->default(false);
        });
        Schema::create('ship_containers', function (Blueprint $table) {
            $table->id();
            $table->string('reference_number')->nullable();
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->string('bol_number')->nullable();
            $table->string('container_type')->nullable();
            $table->string('status')->nullable();
            $table->boolean('quoted')->default(false);
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
        });
        Schema::create('quotations', function (Blueprint $table) {
            $table->id();
            $table->string('quotation_number')->nullable();
            $table->string('title')->nullable();
            $table->unsignedBigInteger('ship_container_id')->nullable();
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->string('currency')->default('KES');
            $table->string('status')->default('draft');
            $table->decimal('subtotal_amount', 15, 2)->default(0);
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
        });
    }

    protected function container(bool $quoted = false): ShipContainer
    {
        return ShipContainer::create([
            'reference_number' => 'REF-1',
            'bol_number' => 'BL-1',
            'container_type' => 'container_import',
            'quoted' => $quoted,
        ]);
    }

    public function test_deleting_a_quotation_frees_its_container(): void
    {
        $container = $this->container();

        $quotation = (new QuotationService)->create([
            'ship_container_id' => $container->id,
            'title' => 'Q1',
        ]);

        $container->refresh();
        $this->assertTrue((bool) $container->quoted);

        (new QuotationService)->delete($quotation->id, 1);

        $container->refresh();
        $this->assertFalse((bool) $container->quoted, 'Container must become quoteable again after its quotation is deleted.');
    }

    public function test_container_stays_quoted_when_another_quotation_holds_it(): void
    {
        $container = $this->container();

        $first = (new QuotationService)->create([
            'ship_container_id' => $container->id,
            'title' => 'Q1',
        ]);

        // A logically-deleted quotation must not free a container that an
        // active quotation still holds.
        \DB::table('quotations')->where('id', $first->id)->update(['is_deleted' => false]);

        $secondId = \DB::table('quotations')->insertGetId([
            'ship_container_id' => $container->id,
            'status' => 'draft',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        (new QuotationService)->delete($secondId, 1);

        $container->refresh();
        $this->assertTrue((bool) $container->quoted, 'Active quotation keeps the container quoted.');
        $this->assertTrue((bool) Quotation::find($first->id)->exists);
    }

    public function test_unlinking_container_on_update_frees_it(): void
    {
        $container = $this->container();

        $quotation = (new QuotationService)->create([
            'ship_container_id' => $container->id,
            'title' => 'Q1',
        ]);

        (new QuotationService)->update($quotation->id, ['ship_container_id' => null]);

        $container->refresh();
        $this->assertFalse((bool) $container->quoted, 'Unlinked container becomes quoteable again.');
    }
}
