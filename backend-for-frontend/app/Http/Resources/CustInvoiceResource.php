<?php

namespace App\Http\Resources;

class CustInvoiceResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'invoice_number' => $this->invoice_number,
            'job_reference_id' => $this->job_reference_id,
            'order_id' => $this->order_id,
            'order_number' => optional($this->order)->order_number,
            'quotation_number' => optional(optional($this->order)->quotation)->quotation_number,
            'project_id' => $this->project_id,
            'customer_id' => $this->customer_id,
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
            'receivingPaymentMethod' => new PaymentReceivingMethodResource($this->whenLoaded('receivingPaymentMethod')),
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,

            'order' => new OrderResource($this->whenLoaded('order')),
            'project' => new ProjectResource($this->whenLoaded('project')),
            'customer' => new CustomerResource($this->whenLoaded('customer')),
            'invoiceItems' => CustInvoiceItemResource::collection($this->whenLoaded('invoiceItems')),
            'payments' => CustPaymentResource::collection($this->whenLoaded('payments')),
            'creditnotes' => CustCreditNoteResource::collection($this->whenLoaded('creditnotes')),
            'documents' => CustInvoiceDocumentResource::collection($this->whenLoaded('documents')),
        ];
    }
}
