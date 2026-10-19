<?php

namespace App\Http\Resources;

use Carbon\Carbon;

class QuotationResource extends BaseResource
{
    public function toArray($request): array
    {
        // Container numbers come through the linked ship container entry
        $numbers = null;
        if ($this->relationLoaded('shipContainer') && $this->shipContainer) {
            $numbers = $this->shipContainer->numbers->pluck('container_no')->all();
        }

        return [
            'id' => $this->id,
            'quotation_number' => $this->quotation_number,
            'bol_number' => $this->bol_number,
            'ship_container_id' => $this->ship_container_id,
            'ship_container' => $this->whenLoaded('shipContainer', new ShipContainerResource($this->shipContainer)),
            'ship_container_numbers' => $numbers,
            'customer_id' => $this->customer_id,
            'project_owner_id' => $this->project_owner_id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'valid_until_date' => $this->formatTimestamp($this->valid_until_date),
            'clearance_deadline' => $this->formatTimestamp($this->clearance_deadline),
            'remaining_clearance_days' => $this->clearance_deadline
                ? (int) Carbon::today()->diffInDays(Carbon::parse($this->clearance_deadline)->startOfDay(), false)
                : null,
            'subtotal_amount' => (float) $this->subtotal_amount,
            'tax_amount' => (float) $this->tax_amount,
            'discount_percentage' => $this->discount_percentage,
            'discount_amount' => (float) $this->discount_amount,
            'total_amount' => (float) $this->total_amount,
            'currency' => $this->currency,
            'payment_receiving_method_id' => $this->payment_receiving_method_id,
            'payment_terms' => $this->payment_terms,
            'min_approval_count' => $this->min_approval_count,
            'notes_to_customer' => $this->notes_to_customer,
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,

            'customer' => new CustomerResource($this->whenLoaded('customer')),

            'quoteItems' => QuoteLineItemResource::collection($this->whenLoaded('quoteItems')),

            'documents' => QuoteDocumentResource::collection($this->whenLoaded('documents')),

            'approvals' => QuoteApprovalResource::collection($this->whenLoaded('approvals')),

            'order' => new OrderResource($this->whenLoaded('order')),

            'created_by_user' => new UserResource($this->whenLoaded('createdByUser')),
            'updated_by_user' => new UserResource($this->whenLoaded('updatedByUser')),

            'project_owner' => new ProjectOwnerResource($this->whenLoaded('projectOwner')),

            'client_name' => $this->projectOwner?->name ?? $this->project_owner_id,

            'receivingPaymentMethod' => new PaymentReceivingMethodResource($this->whenLoaded('receivingPaymentMethod')),

        ];
    }
}
