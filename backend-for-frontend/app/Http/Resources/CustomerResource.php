<?php

namespace App\Http\Resources;

class CustomerResource extends BaseResource
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
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,

            // Aggregate count of projects for list views and summaries
            'projects_count' => isset($this->projects_count)
                ? $this->projects_count
                : ($this->relationLoaded('projects') ? $this->projects->count() : 0),

            'users' => UserResource::collection($this->whenLoaded('users')),
            
            'projects' => ProjectResource::collection($this->whenLoaded('projects')),
            
            'quotations' => QuotationResource::collection($this->whenLoaded('quotations')),
            
            'orders' => OrderResource::collection($this->whenLoaded('orders')),
            
            'invoices' => CustInvoiceResource::collection($this->whenLoaded('invoices')),

        ];
    }
}
