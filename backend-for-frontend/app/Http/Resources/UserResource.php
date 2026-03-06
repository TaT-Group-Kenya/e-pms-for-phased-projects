<?php

namespace App\Http\Resources;

class UserResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'first_name' => $this->first_name,
            'middle_name' => $this->middle_name,
            'last_name' => $this->last_name,
            'password' => null,
            'email_verified_at' => $this->formatTimestamp($this->email_verified_at),
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,
            'remember_token' => null,
            'avatar_pic' => $this->avatar_pic,
            'category' => $this->category,
            'is_active' => (bool) $this->is_active,
            'company_id' => $this->company_id,
            'customer_id' => $this->customer_id,

            'company' => new CompanyResource($this->whenLoaded('company')),

            'customer' => new CustomerResource($this->whenLoaded('customer')),

            // Groups this user belongs to
            'groups' => SysGroupResource::collection($this->whenLoaded('groups')),

            // Roles derived from the user's groups (unique list)
            'roles' => SysRoleResource::collection($this->whenLoaded('roles')),

        ];
    }
}
