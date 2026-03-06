<?php

namespace App\Http\Resources;

class OrderItemResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'item_name' => $this->item_name,
            'item_description' => $this->item_description,
            'order_amount' => (float) $this->order_amount,
            'quantity' => (int) ($this->quantity ?? 1),
            'total' => (float) ($this->total ?? 0),
            'custom_note' => $this->custom_note,
            'is_taxable' => (bool) $this->is_taxable,
            'tax_id' => $this->tax_id,
            'tax_item_name' => $this->tax_item_name,
            'item_type' => $this->item_type,
            'item_value' => $this->item_value !== null ? (float) $this->item_value : null,
            'item_amount' => $this->item_amount !== null ? (float) $this->item_amount : null,
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,

            'order' => new OrderResource($this->whenLoaded('order')),

        ];
    }
}
