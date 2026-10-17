<?php

namespace App\Http\Resources;

class CustDebitNoteItemResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'debit_note_id' => $this->debit_note_id,
            'item_name' => $this->item_name,
            'item_description' => $this->item_description,
            'item_amount' => (float) $this->item_amount,
            'quantity' => (float) $this->quantity,
            'total' => (float) $this->total,
            'is_taxable' => (bool) $this->is_taxable,
            'tax_id' => $this->tax_id,
            'tax_item_name' => $this->tax_item_name,
            'item_type' => $this->item_type,
            'item_value' => $this->item_value === null ? null : (float) $this->item_value,
            'tax_amount' => (float) $this->tax_amount,
            'custom_note' => $this->custom_note,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
        ];
    }
}
