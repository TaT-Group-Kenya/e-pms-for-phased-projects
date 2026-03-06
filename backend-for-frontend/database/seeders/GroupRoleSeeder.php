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
        $userAdminRoles = SysRole::pluck('id')->all();
        $groups = [
            ['id' => 1, 'name' => 'Administrators', 'roleIds' => $userAdminRoles],
            ['id' => 2, 'name' => 'Finance Admins', 'roleIds' => [1,2,3,4,5,6,7,8,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,201,202,203,204,197,198,199,200,84]],
            ['id' => 3, 'name' => 'Project Admins', 'roleIds' => [9,10,11,12,13,14,15,16,73,74,75,76,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172]],
            ['id' => 4, 'name' => 'Account Admins', 'roleIds' => [117,118,119,120]],
        ];

       foreach ($groups as $groupData) {
            $group = SysGroup::firstOrCreate([
                'name' => $groupData['name']
            ], [
                'description' => null,
                'created_by' => 1,
                'updated_by' => 1,
            ]);

            // Attach roles to the group
            if (!empty($groupData['roleIds'])) {
                $group->roles()->syncWithoutDetaching($groupData['roleIds']);
            }
        }
    }
}
