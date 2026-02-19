<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProjectPhaseResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'project_id' => $this->project_id,
            'name' => $this->name,
            'description' => $this->description,
            'phase_order' => $this->phase_order,
            'status' => $this->status,
            'start_date' => $this->start_date?->toISOString(),
            'end_date' => $this->end_date?->toISOString(),
            'progress_percentage' => $this->progress_percentage,
            'quote_item_id' => $this->quote_item_id,
            'updated_at' => $this->updated_at?->toISOString(),
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at?->toISOString(),
            'created_by' => $this->created_by,

            'project' => new ProjectResource($this->whenLoaded('project')),

            'quoteItem' => new QuoteItemResource($this->whenLoaded('quoteItem')),

            'orderItem' => new OrderItemResource($this->whenLoaded('orderItem')),

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
