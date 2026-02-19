<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SysGroupResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'updated_at' => $this->updated_at?->toISOString(),
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at?->toISOString(),
            'created_by' => $this->created_by,

            'roles' => new RolesResource($this->whenLoaded('roles')),

            'users' => new UsersResource($this->whenLoaded('users')),

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
