<?php

namespace App\Http\Resources;

class QuoteLineItemResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'quotation_id' => $this->quotation_id,
            'project_phase_id' => $this->project_phase_id,
            'phase_name' => $this->phase_name,
            'phase_description' => $this->phase_description,
            'quoted_amount' => (float) $this->quoted_amount,
            'estimated_hours_nullable' => $this->estimated_hours_nullable,
            'custom_note' => $this->custom_note,
            'is_taxable' => (bool) $this->is_taxable,
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,

            'quotation' => new QuotationResource($this->whenLoaded('quotation')),

            'projectPhase' => new ProjectPhaseResource($this->whenLoaded('projectPhase')),

        ];
    }
}
