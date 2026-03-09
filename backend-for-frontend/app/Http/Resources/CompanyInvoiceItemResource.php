<?php

namespace App\Http\Resources;

class CompanyInvoiceItemResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'invoice_id' => $this->invoice_id,
            'project_phase_id' => $this->project_phase_id,
            'item_name' => $this->item_name,
            'item_description' => $this->item_description,
            'item_amount' => (float) $this->item_amount,
            'quantity' => (int) ($this->quantity ?? 1),
            'total' => (float) ($this->total ?? 0),
            'is_taxable' => (bool) $this->is_taxable,
            'tax_id' => $this->tax_id,
            'tax_item_name' => $this->tax_item_name,
            'item_type' => $this->item_type,
            'item_value' => $this->item_value !== null ? (float) $this->item_value : null,
            'tax_amount' => $this->tax_amount !== null ? (float) $this->tax_amount : 0.0,
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,

            'invoice' => new CompanyInvoiceResource($this->whenLoaded('invoice')),

            'projectPhase' => new ProjectPhaseResource($this->whenLoaded('projectPhase')),

        ];
    }
}
