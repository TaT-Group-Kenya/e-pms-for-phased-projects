<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CustCreditNoteResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'invoice_id' => $this->invoice_id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'subtotal_amount' => (float) $this->subtotal_amount,
            'tax_percentage' => (float) $this->tax_percentage,
            'tax_amount' => (float) $this->tax_amount,
            'total_amount' => (float) $this->total_amount,
            'currency' => $this->currency,
            'notes_to_customer' => $this->notes_to_customer,
            'updated_at' => $this->updated_at?->toISOString(),
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at?->toISOString(),
            'created_by' => $this->created_by,

            'invoice' => new InvoiceResource($this->whenLoaded('invoice')),

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
