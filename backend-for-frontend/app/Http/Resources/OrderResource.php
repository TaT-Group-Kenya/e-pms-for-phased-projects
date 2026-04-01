<?php

namespace App\Http\Resources;

class OrderResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'job_reference_id' => $this->job_reference_id,
            'quotation_id' => $this->quotation_id,
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
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,

            'quotation' => new QuotationResource($this->whenLoaded('quotation')),

            'project' => new ProjectResource($this->whenLoaded('project')),

            'customer' => new CustomerResource($this->whenLoaded('customer')),

            // Collections
            'orderItems' => OrderItemResource::collection($this->whenLoaded('orderItems')),

            'documents' => OrderDocumentResource::collection($this->whenLoaded('documents')),

            'created_by_user' => new UserResource($this->whenLoaded('creator')),

        ];
    }
}
