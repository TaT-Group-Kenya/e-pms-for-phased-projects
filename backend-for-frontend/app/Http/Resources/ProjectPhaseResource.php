<?php

namespace App\Http\Resources;

class ProjectPhaseResource extends BaseResource
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
            'start_date' => $this->formatTimestamp($this->start_date),
            'end_date' => $this->formatTimestamp($this->end_date),
            'progress_percentage' => $this->progress_percentage,
            'quote_item_id' => $this->quote_item_id,
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,

            'project' => new ProjectResource($this->whenLoaded('project')),

            'quoteItem' => new QuoteLineItemResource($this->whenLoaded('quoteItem')),

            'orderItem' => new OrderItemResource($this->whenLoaded('orderItem')),

        ];
    }
}
