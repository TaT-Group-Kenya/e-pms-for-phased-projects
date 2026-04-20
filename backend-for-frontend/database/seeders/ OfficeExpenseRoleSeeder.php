<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SysRole;
use App\Models\GroupRole;
use Illuminate\Support\Facades\DB;

class OfficeExpenseRoleSeeder extends Seeder
{
    public function run(): void
    {
        // First, ensure group with ID 1 exists
        $groupExists = DB::table('sys_groups')->where('id', 1)->exists();
        
        if (!$groupExists) {
            $this->command->error('Group ID 1 does not exist! Please run SysGroupSeeder first.');
            return;
        }

        $roles = [
            'ROLE_ADD_OFFICE_EXPENSE',
            'ROLE_EDIT_OFFICE_EXPENSE',
            'ROLE_DELETE_OFFICE_EXPENSE',
            'ROLE_VIEW_OFFICE_EXPENSE',
            'ROLE_ADD_OFFICE_EXPENSE_CATEGORY',
            'ROLE_EDIT_OFFICE_EXPENSE_CATEGORY',
            'ROLE_DELETE_OFFICE_EXPENSE_CATEGORY',
            'ROLE_VIEW_OFFICE_EXPENSE_CATEGORY',
        ];

        foreach ($roles as $role) {
            // Create or get the role
            $roleModel = SysRole::firstOrCreate(
                ['name' => $role],
                ['description' => ucwords(strtolower(str_replace('_', ' ', $role)))]
            );
            
            // Assign role to group 1
            GroupRole::firstOrCreate([
                'group_id' => 1,
                'role_id' => $roleModel->id,
            ]);
        }
        
        $this->command->info('Office expense roles and permissions added successfully.');
    }
}