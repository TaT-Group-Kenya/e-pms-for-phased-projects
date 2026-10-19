<?php

use App\Models\SysGroup;
use App\Models\GroupRole;
use App\Models\SysRole;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        // Group ids for roles to attach; falls back to first available group.
        // The Administrators group is normally created by the SysGroupSeeder,
        // but may not exist during migrate:fresh on a bare/test database.
        $adminGroupId = SysGroup::withDeleted()->orderBy('id')->value('id');

        foreach ($this->roles() as $role) {
            $roleModel = SysRole::firstOrCreate([
                'name' => $role,
            ], [
                'description' => ucwords(strtolower(str_replace('_', ' ', $role))),
            ]);

            if ($adminGroupId) {
                GroupRole::firstOrCreate([
                    'group_id' => $adminGroupId,
                    'role_id' => $roleModel->id,
                ]);
            }
        }
    }

    public function down(): void
    {
        $roleIds = SysRole::whereIn('name', $this->roles())->pluck('id');

        GroupRole::whereIn('role_id', $roleIds)->delete();
        SysRole::whereIn('name', $this->roles())->delete();
    }

    private function roles(): array
    {
        return [
            'ROLE_ADD_SHIP_CONTAINER',
            'ROLE_EDIT_SHIP_CONTAINER',
            'ROLE_DELETE_SHIP_CONTAINER',
            'ROLE_VIEW_SHIP_CONTAINER',
        ];
    }
};