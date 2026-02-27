<?php

namespace App\Http\Resources;

class CustCreditNoteResource extends BaseResource
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
            'tax_amount' => (float) $this->tax_amount,
            'total_amount' => (float) $this->total_amount,
            'currency' => $this->currency,
            'notes_to_customer' => $this->notes_to_customer,
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,

            'invoice' => new CustInvoiceResource($this->whenLoaded('invoice')),

        ];
    }
}
