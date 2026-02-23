<?php

namespace App\Http\Resources;

class OrderTaxItemsResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'item_name' => $this->item_name,
            'item_type' => $this->item_type,
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,

            'order' => new OrderResource($this->whenLoaded('order')),

        ];
    }
}
