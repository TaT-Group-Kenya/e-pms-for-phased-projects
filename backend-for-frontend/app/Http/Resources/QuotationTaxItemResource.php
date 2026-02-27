<?php

namespace App\Http\Resources;

class QuotationTaxItemResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'quotation_id' => $this->quotation_id,
            'tax_id' => $this->tax_id,
            'item_name' => $this->item_name,
            'item_type' => $this->item_type,
            'item_value' => $this->item_value !== null ? (float) $this->item_value : null,
            'item_amount' => $this->item_amount !== null ? (float) $this->item_amount : null,
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,

            'quotation' => new QuotationResource($this->whenLoaded('quotation')),
            'tax' => new TaxResource($this->whenLoaded('tax')),
        ];
    }
}
