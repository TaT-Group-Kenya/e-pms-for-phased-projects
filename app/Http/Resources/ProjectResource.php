<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'description' => $this->description,
            'customer_id' => $this->customer_id,
            'project_category_id' => $this->project_category_id,
            'no_of_phases' => $this->no_of_phases,
            'start_date' => $this->start_date?->toISOString(),
            'end_date' => $this->end_date?->toISOString(),
            'budget_estimate' => $this->budget_estimate,
            'status' => $this->status,
            'priority' => $this->priority,
            'progress' => $this->progress,
            'tags' => $this->tags,
            'currency' => $this->currency,
            'updated_at' => $this->updated_at?->toISOString(),
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at?->toISOString(),
            'created_by' => $this->created_by,

            'customer' => new CustomerResource($this->whenLoaded('customer')),

            'category' => new CategoryResource($this->whenLoaded('category')),

            'phases' => new PhasesResource($this->whenLoaded('phases')),

            'order' => new OrderResource($this->whenLoaded('order')),

            'quotation' => new QuotationResource($this->whenLoaded('quotation')),

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
