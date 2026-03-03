<?php

namespace App\Http\Resources;

class CompanyInvoiceResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'invoice_number' => $this->invoice_number,
            'project_id' => $this->project_id,
            'company_id' => $this->company_id,
            'project_phase_id' => $this->project_phase_id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'subtotal_amount' => (float) $this->subtotal_amount,
            'tax_amount' => (float) $this->tax_amount,
            'discount_percentage' => $this->discount_percentage,
            'discount_amount' => (float) $this->discount_amount,
            'total_amount' => (float) $this->total_amount,
            'currency' => $this->currency,
            'payment_terms' => $this->payment_terms,
            'notes_to_customer' => $this->notes_to_customer,
            'valid_until' => $this->valid_until,
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,

            'project' => new ProjectResource($this->whenLoaded('project')),

            'company' => new CompanyResource($this->whenLoaded('company')),

            'invoiceItems' => CompanyInvoiceItemResource::collection($this->whenLoaded('invoiceItems')),

            'payments' => CompanyPaymentResource::collection($this->whenLoaded('payments')),

            'taxitems' => CompanyInvoiceTaxItemResource::collection($this->whenLoaded('taxitems')),

            'creditnotes' => CompanyCreditNoteResource::collection($this->whenLoaded('creditnotes')),

            'documents' => CompanyInvoiceDocumentResource::collection($this->whenLoaded('documents')),

        ];
    }
}
