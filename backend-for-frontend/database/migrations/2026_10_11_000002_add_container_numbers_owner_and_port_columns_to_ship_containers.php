<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Child table holding the container numbers of an entry; the entry's
        // quantity is the count of its numbers and is recomputed on every
        // add/remove.
        Schema::create('ship_container_numbers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ship_container_id')->index();
            $table->string('container_no')->index();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->foreign('ship_container_id')
                ->references('id')
                ->on('ship_containers')
                ->cascadeOnDelete();

            $table->unique(['ship_container_id', 'container_no']);
        });

        Schema::table('ship_containers', function (Blueprint $table) {
            // "Gate In/Out" becomes "Port In/Out" (free-text port names, all types)
            $table->renameColumn('gate_in', 'port_in');
            $table->renameColumn('gate_out', 'port_out');

            // "Get In/Out" becomes datetime and applies to every type (nullable)
            $table->datetime('get_in')->nullable()->change();
            $table->datetime('get_out')->nullable()->change();

            // Client Name becomes the project owner entity (optional FK)
            $table->unsignedBigInteger('project_owner_id')->nullable()->after('customer_id');

            $table->foreign('project_owner_id')
                ->references('id')
                ->on('project_owners')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('ship_containers', function (Blueprint $table) {
            $table->dropForeign(['project_owner_id']);
            $table->dropColumn('project_owner_id');
            $table->renameColumn('port_in', 'gate_in');
            $table->renameColumn('port_out', 'gate_out');
            $table->date('get_in')->nullable()->change();
            $table->date('get_out')->nullable()->change();
        });

        Schema::dropIfExists('ship_container_numbers');
    }
};