<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'project_phase_id' => $this->project_phase_id,
            'item_name' => $this->item_name,
            'item_description' => $this->item_description,
            'order_amount' => (float) $this->order_amount,
            'custom_note' => $this->custom_note,
            'is_taxable' => (bool) $this->is_taxable,
            'updated_at' => $this->updated_at?->toISOString(),
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at?->toISOString(),
            'created_by' => $this->created_by,

            'order' => new OrderResource($this->whenLoaded('order')),

            'projectPhase' => new ProjectPhaseResource($this->whenLoaded('projectPhase')),

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
