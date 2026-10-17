<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $roles = [];
        foreach (['CUST_DEBIT_NOTE', 'CUST_DEBIT_NOTE_ITEM', 'CUST_DEBIT_NOTE_DOCUMENT'] as $roleBase) {
            foreach (['ADD', 'EDIT', 'DELETE', 'VIEW'] as $action) {
                $roles[] = "ROLE_{$action}_{$roleBase}";
            }
        }

        foreach ($roles as $role) {
            if (! DB::table('sys_roles')->where('name', $role)->exists()) {
                DB::table('sys_roles')->insert([
                    'name' => $role,
                    'description' => null,
                    'created_by' => 1,
                    'updated_by' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                    'is_deleted' => false,
                ]);
            }
        }
    }

    public function down(): void
    {
        // Keep authorization data in place because roles may have been assigned to groups.
    }
};
