<?php

namespace App\Http\Resources;

class CustCreditNoteTaxItemResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'credit_note_id' => $this->credit_note_id,
            'tax_id' => $this->tax_id,
            'item_name' => $this->item_name,
            'item_type' => $this->item_type,
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,

            'creditNote' => new CreditNoteResource($this->whenLoaded('creditNote')),
            'tax' => new TaxResource($this->whenLoaded('tax')),

        ];
    }
}
