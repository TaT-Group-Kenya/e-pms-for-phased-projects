<?php

namespace App\Http\Resources;

class QuotationResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'quotation_number' => $this->quotation_number,
            'project_id' => $this->project_id,
            'customer_id' => $this->customer_id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'valid_until_date' => $this->formatTimestamp($this->valid_until_date),
            'subtotal_amount' => (float) $this->subtotal_amount,
            'tax_percentage' => (float) $this->tax_percentage,
            'tax_amount' => (float) $this->tax_amount,
            'discount_percentage' => $this->discount_percentage,
            'discount_amount' => (float) $this->discount_amount,
            'total_amount' => (float) $this->total_amount,
            'currency' => $this->currency,
            'payment_terms' => $this->payment_terms,
            'min_approval_count' => $this->min_approval_count,
            'notes_to_customer' => $this->notes_to_customer,
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,

            'project' => new ProjectResource($this->whenLoaded('project')),

            'customer' => new CustomerResource($this->whenLoaded('customer')),

            'quoteItems' => new QuoteItemsResource($this->whenLoaded('quoteItems')),

            'documents' => new DocumentsResource($this->whenLoaded('documents')),

            'approvals' => new ApprovalsResource($this->whenLoaded('approvals')),

            'order' => new OrderResource($this->whenLoaded('order')),

        ];
    }
}
