<?php

namespace App\Http\Resources;

class CompanyResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'email' => $this->email,
            'phone' => $this->phone,
            'contact_person_name' => $this->contact_person_name,
            'logo' => $this->logo,
            'address' => $this->address,
            'city' => $this->city,
            'state' => $this->state,
            'country' => $this->country,
            'kra_pin' => $this->kra_pin,
            'created_at' => $this->formatTimestamp($this->created_at),
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
        ];
    }
}
