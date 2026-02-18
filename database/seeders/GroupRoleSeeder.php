<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SysGroup;
use App\Models\SysRole;

class GroupRoleSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure the group exists
        $group = SysGroup::firstOrCreate([
            'name' => 'Administrators'
        ], [
            'description' => null,
            'created_by' => 1,
            'updated_by' => 1,
        ]);

        // Get all role IDs and attach them to the group
        $roleIds = SysRole::pluck('id')->all();
        if (!empty($roleIds)) {
            $group->roles()->syncWithoutDetaching($roleIds);
        }
    }
}
