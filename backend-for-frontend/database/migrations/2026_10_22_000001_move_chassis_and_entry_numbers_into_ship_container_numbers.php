<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * ShipContainerNumber now owns the chassis number (as container_no) and the
     * optional per-number fields (size, size_unit, goods_description,
     * entry_number). The ship_containers-level chassis_no and entry_number
     * columns are retired: chassis numbers are backfilled as tracked numbers,
     * a container-level entry number moves onto its first number row and the
     * quantity is recomputed before both columns are dropped.
     */
    public function up(): void
    {
        // 1) A chassis number becomes a tracked number of its entry.
        // Backfills only run on databases created before the columns were
        // retired; fresh installs never had them.
        if (Schema::hasColumn('ship_containers', 'chassis_no')) {
            $chassisRows = DB::table('ship_containers')
                ->whereNotNull('chassis_no')
                ->where('chassis_no', '!=', '')
                ->get(['id', 'chassis_no', 'created_by', 'created_at']);

            foreach ($chassisRows as $row) {
                $chassisNo = strtoupper(trim((string) $row->chassis_no));

                $exists = DB::table('ship_container_numbers')
                    ->where('ship_container_id', $row->id)
                    ->whereRaw('UPPER(container_no) = ?', [$chassisNo])
                    ->exists();

                if (! $exists) {
                    DB::table('ship_container_numbers')->insert([
                        'ship_container_id' => $row->id,
                        'container_no' => $chassisNo,
                        'size' => null,
                        'size_unit' => 'feet',
                        'goods_description' => null,
                        'entry_number' => null,
                        'created_by' => $row->created_by,
                        'created_at' => $row->created_at,
                        'updated_at' => $row->created_at,
                    ]);
                }
            }
        }

        // 2) A container-level entry number belongs to its first number row.
        if (Schema::hasColumn('ship_containers', 'entry_number')) {
            $entryRows = DB::table('ship_containers')
                ->whereNotNull('entry_number')
                ->where('entry_number', '!=', '')
                ->get(['id', 'entry_number']);

            foreach ($entryRows as $row) {
                DB::table('ship_container_numbers')
                    ->where('ship_container_id', $row->id)
                    ->whereNull('entry_number')
                    ->orderBy('id')
                    ->limit(1)
                    ->update(['entry_number' => $row->entry_number]);
            }
        }

        // 3) Quantity always equals the count of tracked numbers.
        DB::statement('
            UPDATE ship_containers
            SET quantity = (
                SELECT COUNT(*) FROM ship_container_numbers
                WHERE ship_container_numbers.ship_container_id = ship_containers.id
            )
        ');

        // 4) Retire the container-level columns.
        Schema::table('ship_containers', function (Blueprint $table) {
            if (Schema::hasColumn('ship_containers', 'chassis_no')) {
                $table->dropColumn('chassis_no');
            }
        });

        Schema::table('ship_containers', function (Blueprint $table) {
            if (Schema::hasColumn('ship_containers', 'entry_number')) {
                $table->dropColumn('entry_number');
            }
        });
    }

    public function down(): void
    {
        // The entry number can be restored from the first tracked number row;
        // chassis numbers merged into the numbers list cannot be identified
        // retroactively, so chassis_no is restored empty (lossy rollback).
        Schema::table('ship_containers', function (Blueprint $table) {
            if (! Schema::hasColumn('ship_containers', 'chassis_no')) {
                $table->string('chassis_no')->nullable();
            }
        });

        Schema::table('ship_containers', function (Blueprint $table) {
            if (! Schema::hasColumn('ship_containers', 'entry_number')) {
                $table->string('entry_number')->nullable();
            }
        });

        DB::statement('
            UPDATE ship_containers
            SET entry_number = COALESCE((
                SELECT entry_number FROM ship_container_numbers
                WHERE ship_container_numbers.ship_container_id = ship_containers.id
                ORDER BY ship_container_numbers.id
                LIMIT 1
            ), NULL)
        ');
    }
};
