<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();
        $configs = [
            ['readonly' => true, 'name' => 'SHIP_CONTAINER_TRANSIT_EXIT_DAYS', 'value' => '30'],
            ['readonly' => true, 'name' => 'SHIP_CONTAINER_TRANSIT_NOTIFY_DAY', 'value' => '25'],
        ];

        foreach ($configs as $config) {
            DB::table('sys_configs')->insert(array_merge($config, [
                'created_at' => $now,
                'updated_at' => $now,
                'created_by' => 1,
                'updated_by' => 1,
            ]));
        }
    }

    public function down(): void
    {
        DB::table('sys_configs')->whereIn('name', [
            'SHIP_CONTAINER_TRANSIT_EXIT_DAYS',
            'SHIP_CONTAINER_TRANSIT_NOTIFY_DAY',
        ])->delete();
    }
};