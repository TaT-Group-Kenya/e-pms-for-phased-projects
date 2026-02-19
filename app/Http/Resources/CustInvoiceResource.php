<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CustInvoiceResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'invoice_number' => $this->invoice_number,
            'order_id' => $this->order_id,
            'project_id' => $this->project_id,
            'customer_id' => $this->customer_id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'subtotal_amount' => (float) $this->subtotal_amount,
            'tax_percentage' => (float) $this->tax_percentage,
            'tax_amount' => (float) $this->tax_amount,
            'discount_percentage' => $this->discount_percentage,
            'discount_amount' => (float) $this->discount_amount,
            'total_amount' => (float) $this->total_amount,
            'currency' => $this->currency,
            'payment_terms' => $this->payment_terms,
            'notes_to_customer' => $this->notes_to_customer,
            'valid_until' => $this->valid_until,
            'updated_at' => $this->updated_at?->toISOString(),
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at?->toISOString(),
            'created_by' => $this->created_by,

            'order' => new OrderResource($this->whenLoaded('order')),

            'project' => new ProjectResource($this->whenLoaded('project')),

            'customer' => new CustomerResource($this->whenLoaded('customer')),

            'invoiceItems' => new InvoiceItemsResource($this->whenLoaded('invoiceItems')),

            'payments' => new PaymentsResource($this->whenLoaded('payments')),

            'creditnotes' => new CreditnotesResource($this->whenLoaded('creditnotes')),

            'taxitems' => new TaxitemsResource($this->whenLoaded('taxitems')),

            'documents' => new DocumentsResource($this->whenLoaded('documents')),

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
