<?php

namespace App\Http\Resources;

class OrderItemResource extends BaseResource
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
            'quantity' => (int) ($this->quantity ?? 1),
            'total' => (float) ($this->total ?? 0),
            'custom_note' => $this->custom_note,
            'is_taxable' => (bool) $this->is_taxable,
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,

            'order' => new OrderResource($this->whenLoaded('order')),

            'projectPhase' => new ProjectPhaseResource($this->whenLoaded('projectPhase')),

        ];
    }
}
