<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectOwnerResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'contact_person_name' => $this->contact_person_name,
            'logo' => $this->logo,
            'description' => $this->description,
            'address' => $this->address,
            'city' => $this->city,
            'state' => $this->state,
            'country' => $this->country,
            'kra_pin' => $this->kra_pin,
            'customer_id' => $this->customer_id,
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,

            // Aggregate count of projects for list views and summaries
            'projects_count' => isset($this->projects_count)
                ? $this->projects_count
                : ($this->relationLoaded('projects') ? $this->projects->count() : 0),

            'customer' => CustomerResource::collection($this->whenLoaded('customer')),
            
            'projects' => ProjectResource::collection($this->whenLoaded('projects')),
            
            'quotations' => QuotationResource::collection($this->whenLoaded('quotations')),
            
            'orders' => OrderResource::collection($this->whenLoaded('orders')),
            
            'invoices' => CustInvoiceResource::collection($this->whenLoaded('invoices')),
        ];
    }
}
