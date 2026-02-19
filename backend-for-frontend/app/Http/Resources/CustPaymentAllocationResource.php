<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CustPaymentAllocationResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'payment_id' => $this->payment_id,
            'invoice_id' => $this->invoice_id,
            'allocated_amount' => (float) $this->allocated_amount,
            'allocation_date' => $this->allocation_date?->toISOString(),
            'balance_before_payment' => $this->balance_before_payment,
            'balance_after_payment' => $this->balance_after_payment,
            'installment_number' => $this->installment_number,
            'updated_at' => $this->updated_at?->toISOString(),
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at?->toISOString(),
            'created_by' => $this->created_by,

            'payment' => new PaymentResource($this->whenLoaded('payment')),

            'invoice' => new InvoiceResource($this->whenLoaded('invoice')),

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
