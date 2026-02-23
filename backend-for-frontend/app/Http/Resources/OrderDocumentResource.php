<?php

namespace App\Http\Resources;

class OrderDocumentResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'document_path' => $this->document_path,
            'document_type' => $this->document_type,
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,

            'order' => new OrderResource($this->whenLoaded('order')),

        ];
    }
}
