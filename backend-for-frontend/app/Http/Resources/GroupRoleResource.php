<?php

namespace App\Http\Resources;

class GroupRoleResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'group_id' => $this->group_id,
            'role_id' => $this->role_id,
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,

            'group' => new GroupResource($this->whenLoaded('group')),

            'role' => new RoleResource($this->whenLoaded('role')),

        ];
    }
}
