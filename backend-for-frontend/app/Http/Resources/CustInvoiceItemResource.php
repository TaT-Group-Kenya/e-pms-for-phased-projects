<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CustInvoiceItemResource extends JsonResource
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
            'is_taxable' => (bool) $this->is_taxable,
            'custom_note' => $this->custom_note,
            'updated_at' => $this->updated_at?->toISOString(),
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at?->toISOString(),
            'created_by' => $this->created_by,

            'invoice' => new InvoiceResource($this->whenLoaded('invoice')),

            'projectPhase' => new ProjectPhaseResource($this->whenLoaded('projectPhase')),

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
