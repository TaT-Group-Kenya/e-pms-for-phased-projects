<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use App\Models\SysRole;
use App\Models\GroupRole;

return new class extends Migration
{
    public function up()
    {
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
            'ROLE_ADD_OFFICE_EXPENSE',
            'ROLE_EDIT_OFFICE_EXPENSE',
            'ROLE_DELETE_OFFICE_EXPENSE',
            'ROLE_VIEW_OFFICE_EXPENSE',
            'ROLE_ADD_OFFICE_EXPENSE_CATEGORY',
            'ROLE_EDIT_OFFICE_EXPENSE_CATEGORY',
            'ROLE_DELETE_OFFICE_EXPENSE_CATEGORY',
            'ROLE_VIEW_OFFICE_EXPENSE_CATEGORY',
        ];
        $roleIds = SysRole::whereIn('name', $roles)->pluck('id');
        GroupRole::where('group_id', 1)->whereIn('role_id', $roleIds)->delete();
        SysRole::whereIn('name', $roles)->delete();
    }
};
