<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use App\Models\SysRole;
use App\Models\GroupRole;

return new class extends Migration {
    public function up()
    {
        // Insert new roles for PaymentReceivingMethod
        // $roles = [
        //     'ROLE_ADD_PAYMENT_RECEIVING_METHOD',
        //     'ROLE_EDIT_PAYMENT_RECEIVING_METHOD',
        //     'ROLE_DELETE_PAYMENT_RECEIVING_METHOD',
        //     'ROLE_VIEW_PAYMENT_RECEIVING_METHOD',
        // ];
        // foreach ($roles as $role) {
        //     $roleModel = SysRole::firstOrCreate([
        //         'name' => $role,
        //     ], [
        //         'description' => ucwords(strtolower(str_replace('_', ' ', $role))),
        //     ]);
        //     GroupRole::firstOrCreate([
        //         'group_id' => 1,
        //         'role_id' => $roleModel->id,
        //     ]);
        // }
    }

    public function down()
    {
        $roles = [
            'ROLE_ADD_PAYMENT_RECEIVING_METHOD',
            'ROLE_EDIT_PAYMENT_RECEIVING_METHOD',
            'ROLE_DELETE_PAYMENT_RECEIVING_METHOD',
            'ROLE_VIEW_PAYMENT_RECEIVING_METHOD',
        ];
        $roleIds = DB::table('sys_roles')->whereIn('name', $roles)->pluck('id');
        DB::table('sys_group_role')->whereIn('role_id', $roleIds)->where('group_id', 1)->delete();
        DB::table('sys_roles')->whereIn('id', $roleIds)->delete();
    }
};
