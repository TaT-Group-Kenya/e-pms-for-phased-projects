<?php

namespace App\Http\Resources;

class CompanyInvoiceTaxItemResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'invoice_id' => $this->invoice_id,
            'item_name' => $this->item_name,
            'item_type' => $this->item_type,
            'item_value' => $this->item_value,
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,

            'invoice' => new InvoiceResource($this->whenLoaded('invoice')),

        ];
    }
}
