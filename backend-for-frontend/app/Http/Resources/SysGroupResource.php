<?php

namespace App\Http\Resources;

class SysGroupResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,

            'roles' => new RolesResource($this->whenLoaded('roles')),

            'users' => new UsersResource($this->whenLoaded('users')),

        ];
    }
}
