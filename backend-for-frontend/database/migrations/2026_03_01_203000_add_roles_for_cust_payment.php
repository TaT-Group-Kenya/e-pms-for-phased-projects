<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use App\Models\SysRole;

return new class extends Migration
{
    public function up(): void
    {
        $roles = [
            'ROLE_ADD_CUST_PAYMENT',
            'ROLE_EDIT_CUST_PAYMENT',
            'ROLE_DELETE_CUST_PAYMENT',
            'ROLE_VIEW_CUST_PAYMENT',
        ];

        foreach ($roles as $role) {
            SysRole::firstOrCreate(
                ['name' => $role],
                [
                    'description' => null,
                    'created_by'  => 1,
                    'updated_by'  => 1,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]
            );
        }
    }

    public function down(): void
    {
        $roles = [
            'ROLE_ADD_CUST_PAYMENT',
            'ROLE_EDIT_CUST_PAYMENT',
            'ROLE_DELETE_CUST_PAYMENT',
            'ROLE_VIEW_CUST_PAYMENT',
        ];

        SysRole::whereIn('name', $roles)->delete();
    }
};
