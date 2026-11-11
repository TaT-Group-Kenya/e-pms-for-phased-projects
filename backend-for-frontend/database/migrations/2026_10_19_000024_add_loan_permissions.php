<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Adds the Loans permission set (ROLE_ADD_LOAN, ROLE_EDIT_LOAN,
     * ROLE_DELETE_LOAN, ROLE_VIEW_LOAN) and attaches it to groups that
     * already carry the Account permission set. Idempotent: roles are
     * matched by name and group-role attachments by composite key, so
     * re-running after a rollback never duplicates.
     */
    public function up(): void
    {
        if (! Schema::hasTable('sys_roles') || ! Schema::hasTable('sys_groups')) {
            return;
        }

        $roles = [
            'ROLE_ADD_LOAN',
            'ROLE_EDIT_LOAN',
            'ROLE_DELETE_LOAN',
            'ROLE_VIEW_LOAN',
        ];

        foreach ($roles as $role) {
            DB::table('sys_roles')->insertOrIgnore([
                'name' => $role,
                'description' => null,
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $loanRoleIds = DB::table('sys_roles')
            ->whereIn('name', $roles)
            ->where('is_deleted', false)
            ->pluck('id');

        // Attach to every group that already has the Account roles, so
        // loans (and lenders, which share this set) reach the same viewers.
        $accountRoleIds = DB::table('sys_roles')
            ->whereIn('name', ['ROLE_ADD_ACCOUNT', 'ROLE_EDIT_ACCOUNT', 'ROLE_DELETE_ACCOUNT', 'ROLE_VIEW_ACCOUNT'])
            ->where('is_deleted', false)
            ->pluck('id');

        $groupIds = DB::table('group_roles')
            ->whereIn('role_id', $accountRoleIds)
            ->where('is_deleted', false)
            ->distinct()
            ->pluck('group_id');

        foreach ($groupIds as $groupId) {
            foreach ($loanRoleIds as $roleId) {
                DB::table('group_roles')->insertOrIgnore([
                    'group_id' => $groupId,
                    'role_id' => $roleId,
                    'is_deleted' => false,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('sys_roles')) {
            return;
        }

        $loanRoleIds = DB::table('sys_roles')
            ->whereIn('name', ['ROLE_ADD_LOAN', 'ROLE_EDIT_LOAN', 'ROLE_DELETE_LOAN', 'ROLE_VIEW_LOAN'])
            ->pluck('id');

        DB::table('group_roles')->whereIn('role_id', $loanRoleIds)->delete();
        DB::table('sys_roles')->whereIn('id', $loanRoleIds)->delete();
    }
};
