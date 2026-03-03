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

            // Number of projects associated with this company (via assignments)
            'projects' => isset($this->assignments_count)
                ? $this->assignments_count
                : ($this->relationLoaded('assignments') ? $this->assignments->count() : 0),

            'users' => UserResource::collection($this->whenLoaded('users')),
            'assignments' => CompanyProjectResource::collection($this->whenLoaded('assignments')),
            'bank_accounts' => CompanyBankResource::collection($this->whenLoaded('bankAccounts')),
            'invoices' => CompanyInvoiceResource::collection($this->whenLoaded('invoices')),
        ];
    }
}
