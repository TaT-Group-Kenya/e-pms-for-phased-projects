<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'first_name' => $this->first_name,
            'middle_name' => $this->middle_name,
            'last_name' => $this->last_name,
            'password' => $this->password,
            'email_verified_at' => $this->email_verified_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at?->toISOString(),
            'created_by' => $this->created_by,
            'remember_token' => $this->remember_token,
            'avatar_pic' => $this->avatar_pic,
            'category' => $this->category,
            'is_active' => (bool) $this->is_active,
            'company_id' => $this->company_id,
            'customer_id' => $this->customer_id,

            'company' => new CompanyResource($this->whenLoaded('company')),

            'customer' => new CustomerResource($this->whenLoaded('customer')),

            'groups' => new GroupsResource($this->whenLoaded('groups')),

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
