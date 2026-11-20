<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Adds the Accounting Periods permission set and attaches it:
 *  - ROLE_VIEW_ACCOUNTING_PERIOD  -> Administrators, Finance Admins, Account Admins
 *  - ROLE_CLOSE_ACCOUNTING_PERIOD -> same groups (period review/close duty)
 *  - ROLE_REOPEN_ACCOUNTING_PERIOD -> Administrators only (controlled reopening).
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('sys_roles') || ! Schema::hasTable('sys_groups')) {
            return;
        }

        $roles = [
            'ROLE_VIEW_ACCOUNTING_PERIOD' => 'View accounting periods and their audit trail',
            'ROLE_CLOSE_ACCOUNTING_PERIOD' => 'Close accounting periods (month-end review and close)',
            'ROLE_REOPEN_ACCOUNTING_PERIOD' => 'Reopen closed accounting periods (administrator)',
        ];

        foreach ($roles as $role => $description) {
            \DB::table('sys_roles')->insertOrIgnore([
                'name' => $role,
                'description' => $description,
                'is_deleted' => false,
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $roleIds = \DB::table('sys_roles')
            ->whereIn('name', array_keys($roles))
            ->where('is_deleted', false)
            ->pluck('id', 'name');

        if ($roleIds->isEmpty()) {
            return;
        }

        $closeRoleIds = $roleIds->intersectByKeys([
            'ROLE_VIEW_ACCOUNTING_PERIOD' => true,
            'ROLE_CLOSE_ACCOUNTING_PERIOD' => true,
        ]);

        // Attach view + close to groups that can view financial ledgers
        // (Administrators, Finance Admins, Account Admins, ...) so the
        // month-end review/close duty sits with the finance people.
        $ledgerViewRoleIds = \DB::table('sys_roles')
            ->where('name', 'like', 'ROLE_VIEW_%TRANSACTIONS_LEDGER')
            ->where('is_deleted', false)
            ->pluck('id');

        $groupIds = \DB::table('group_roles')
            ->whereIn('role_id', $ledgerViewRoleIds)
            ->join('sys_groups', function ($join) {
                $join->on('sys_groups.id', '=', 'group_roles.group_id')
                    ->where('sys_groups.is_deleted', false);
            })
            ->where('group_roles.is_deleted', false)
            ->distinct()
            ->pluck('group_id');

        foreach ($closeRoleIds as $roleId) {
            foreach ($groupIds as $groupId) {
                \DB::table('group_roles')->insertOrIgnore([
                    'group_id' => $groupId,
                    'role_id' => $roleId,
                    'is_deleted' => false,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Administrators group: attach all three roles explicitly (view,
        // close and the administrator-only reopen duty).
        $adminGroupId = \DB::table('sys_groups')->where('name', 'Administrators')->where('is_deleted', false)->value('id');
        if ($adminGroupId && ! \DB::table('group_roles')->where('group_id', $adminGroupId)->whereIn('role_id', $roleIds->values())->exists()) {
            foreach ($closeRoleIds as $roleId) {
                \DB::table('group_roles')->insertOrIgnore([
                    'group_id' => $adminGroupId,
                    'role_id' => $roleId,
                    'is_deleted' => false,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
            if ($roleIds->has('ROLE_REOPEN_ACCOUNTING_PERIOD')) {
                \DB::table('group_roles')->insertOrIgnore([
                    'group_id' => $adminGroupId,
                    'role_id' => $roleIds->get('ROLE_REOPEN_ACCOUNTING_PERIOD'),
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

        $roleIds = \DB::table('sys_roles')
            ->whereIn('name', [
                'ROLE_VIEW_ACCOUNTING_PERIOD',
                'ROLE_CLOSE_ACCOUNTING_PERIOD',
                'ROLE_REOPEN_ACCOUNTING_PERIOD',
            ])
            ->pluck('id');

        if ($roleIds->isNotEmpty() && Schema::hasTable('group_roles')) {
            \DB::table('group_roles')->whereIn('role_id', $roleIds)->delete();
        }

        \DB::table('sys_roles')->whereIn('id', $roleIds)->delete();
    }
};
