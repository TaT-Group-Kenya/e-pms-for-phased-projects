<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // A single normalized-by-discriminator table holds all shipment container
        // types (import/export/transit containers and transit/import loose units).
        // Shared tracking columns are common, type-specific tracking columns are
        // nullable and validated per type in ShipContainerStoreRequest.
        Schema::create('ship_containers', function (Blueprint $table) {
            $table->id();
            $table->string('reference_number')->nullable()->unique();

            $table->enum('container_type', ['container_import', 'container_export', 'container_transit', 'unit_transit', 'unit_import'])->index();

            // Shared identification / movement columns
            $table->unsignedBigInteger('customer_id')->nullable()->index();
            $table->string('client_name')->nullable()->index();
            $table->date('eta')->nullable();
            $table->date('etd')->nullable();
            $table->date('gate_in')->nullable()->index();
            $table->date('gate_out')->nullable();

            $table->string('container_no')->nullable()->index();
            $table->string('container_number')->nullable(); // unit_transit column label
            $table->string('container_ref')->nullable(); // import unit column label ("CONTAINER")
            $table->string('description', 2000)->nullable();
            $table->decimal('quantity', 18, 4)->nullable();
            $table->string('bl_no')->nullable();
            $table->string('bol_no')->nullable();
            $table->string('shipping_line')->nullable()->index();
            $table->string('shipping_agent')->nullable();
            $table->string('vessel')->nullable();

            // Status / clearance columns
            $table->string('entry_status')->nullable();
            $table->string('tr10_entry_status')->nullable();
            $table->string('tr12_entry_status')->nullable();
            $table->string('entry_number')->nullable(); // exports "ENTRY"
            $table->string('booking_no')->nullable();
            $table->string('do_status')->nullable();
            $table->string('allocation')->nullable();
            $table->string('guarantee_status')->nullable();
            $table->string('empty_status')->nullable();
            $table->string('person_incharge')->nullable();
            $table->enum('status', ['pending', 'in_progress', 'cleared', 'exited', 'on_hold'])->default('pending')->index();

            // Transit tracking
            $table->date('last_free_day')->nullable();
            $table->string('cfs')->nullable();
            $table->string('destination')->nullable();
            $table->date('gt_expiration_date')->nullable();
            $table->timestamp('exit_date')->nullable()->index();
            $table->string('exit_border')->nullable();
            $table->string('exit_remarks', 2000)->nullable();
            $table->integer('bond_extension_days')->nullable();

            // Exports / location columns
            $table->string('location')->nullable();
            $table->string('goods_description')->nullable(); // exports "GOODS DESCRIPTION"
            $table->string('coe')->nullable(); // exports "COE"

            // Loose unit columns
            $table->string('chassis_no')->nullable();
            $table->string('registration_no')->nullable();
            $table->string('station')->nullable();
            $table->text('remarks')->nullable();

            $table->timestamps();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ship_containers');
    }
};