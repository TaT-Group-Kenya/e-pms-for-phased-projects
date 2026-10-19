<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        foreach ([
            ['name' => 'CUST_DEBIT_NOTE_PREFIX', 'value' => 'CDN-'],
            ['name' => 'CUST_DEBIT_NOTE_INCREMENT', 'value' => '1'],
            ['name' => 'CUST_DEBIT_NOTE_NUMBER_LENGTH', 'value' => '6'],
        ] as $config) {
            DB::table('sys_configs')->updateOrInsert(
                ['name' => $config['name']],
                [
                    'value' => $config['value'],
                    'readonly' => true,
                    'is_file' => false,
                    'created_at' => $now,
                    'created_by' => 1,
                    'updated_at' => $now,
                    'updated_by' => 1,
                    'is_deleted' => false,
                ]
            );
        }
    }

    public function down(): void
    {
        DB::table('sys_configs')->whereIn('name', [
            'CUST_DEBIT_NOTE_PREFIX',
            'CUST_DEBIT_NOTE_INCREMENT',
            'CUST_DEBIT_NOTE_NUMBER_LENGTH',
        ])->delete();
    }
};