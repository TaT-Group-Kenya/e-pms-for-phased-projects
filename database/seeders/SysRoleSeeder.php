<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SysRole;

class SysRoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            'ROLE_ADD_USER',
            'ROLE_EDIT_USER',
            'ROLE_DELETE_USER',
            'ROLE_VIEW_USER',
            'ROLE_ADD_COMPANY',
            'ROLE_EDIT_COMPANY',
            'ROLE_DELETE_COMPANY',
            'ROLE_VIEW_COMPANY',
            'ROLE_ADD_CUSTOMER',
            'ROLE_EDIT_CUSTOMER',
            'ROLE_DELETE_CUSTOMER',
            'ROLE_VIEW_CUSTOMER',
            'ROLE_ADD_PROJECT',
            'ROLE_EDIT_PROJECT',
            'ROLE_DELETE_PROJECT',
            'ROLE_VIEW_PROJECT',
            'ROLE_ADD_DEPARTMENT',
            'ROLE_EDIT_DEPARTMENT',
            'ROLE_DELETE_DEPARTMENT',
            'ROLE_VIEW_DEPARTMENT',
            'ROLE_ADD_QUOTATION',
            'ROLE_EDIT_QUOTATION',
            'ROLE_DELETE_QUOTATION',
            'ROLE_VIEW_QUOTATION',
            'ROLE_ADD_ORDER',
            'ROLE_EDIT_ORDER',
            'ROLE_DELETE_ORDER',
            'ROLE_VIEW_ORDER',
            'ROLE_ADD_INVOICE',
            'ROLE_EDIT_INVOICE',
            'ROLE_DELETE_INVOICE',
            'ROLE_VIEW_INVOICE',
            'ROLE_ADD_CREDIT_NOTE',
            'ROLE_EDIT_CREDIT_NOTE',
            'ROLE_DELETE_CREDIT_NOTE',
            'ROLE_VIEW_CREDIT_NOTE',
            'ROLE_ADD_USER_GROUP',
            'ROLE_EDIT_USER_GROUP',
            'ROLE_DELETE_USER_GROUP',
            'ROLE_VIEW_USER_GROUP',
            'ROLE_ADD_ROLE',
            'ROLE_EDIT_ROLE',
            'ROLE_DELETE_ROLE',
            'ROLE_VIEW_ROLE',
            'ROLE_ADD_CONFIG',
            'ROLE_EDIT_CONFIG',
            'ROLE_DELETE_CONFIG',
            'ROLE_VIEW_CONFIG',
            'ROLE_ADD_ACCOUNT',
            'ROLE_EDIT_ACCOUNT',
            'ROLE_DELETE_ACCOUNT',
            'ROLE_VIEW_ACCOUNT',
        ];

        foreach ($roles as $role) {
            SysRole::firstOrCreate(
                ['name' => $role],
                ['description' => null],
                ['updated_by' => 1, 'created_by' => 1]
            );
        }
    }
}
