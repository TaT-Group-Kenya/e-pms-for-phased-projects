<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use App\Models\SysRole;
use App\Models\GroupRole;

return new class extends Migration {
    public function up()
    {
        // Insert new roles
        $roles = [
            'ROLE_ADD_OFFICE_EXPENSE_PAYMENT',
            'ROLE_EDIT_OFFICE_EXPENSE_PAYMENT',
            'ROLE_DELETE_OFFICE_EXPENSE_PAYMENT',
            'ROLE_VIEW_OFFICE_EXPENSE_PAYMENT',
        ];
        foreach ($roles as $role) {
            $roleModel = SysRole::firstOrCreate([
                'name' => $role,
            ], [
                'description' => ucwords(strtolower(str_replace('_', ' ', $role))),
            ]);
            GroupRole::firstOrCreate([
                'group_id' => 1,
                'role_id' => $roleModel->id,
            ]);
        }
    }

    public function down()
    {
        $roles = [
            'ROLE_ADD_OFFICE_EXPENSE_PAYMENT',
            'ROLE_EDIT_OFFICE_EXPENSE_PAYMENT',
            'ROLE_DELETE_OFFICE_EXPENSE_PAYMENT',
            'ROLE_VIEW_OFFICE_EXPENSE_PAYMENT',
        ];
        $roleIds = DB::table('sys_roles')->whereIn('name', $roles)->pluck('id');
        DB::table('sys_group_role')->whereIn('role_id', $roleIds)->where('group_id', 1)->delete();
        DB::table('sys_roles')->whereIn('id', $roleIds)->delete();
    }
};
