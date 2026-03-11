<?php

namespace App\Http\Resources;

class CompanyCreditNoteResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'credit_note_number' => $this->credit_note_number,
            'invoice_id' => $this->invoice_id,
            'credit_note_date' => $this->formatTimestamp($this->credit_note_date),
            'title' => $this->title,
            'description' => $this->description,
            'reason' => $this->reason,
            'subtotal_amount' => (float) $this->subtotal_amount,
            'tax_amount' => (float) $this->tax_amount,
            'total_amount' => (float) $this->total_amount,
            'currency' => $this->currency,
            'exchange_rate' => (float) $this->exchange_rate,
            'notes_to_customer' => $this->notes_to_customer,
            'status' => $this->status,
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,
            'invoice' => new CompanyInvoiceResource($this->whenLoaded('invoice')),

            'items' => CompanyCreditNoteItemResource::collection($this->whenLoaded('items')),
        ];
    }
}
