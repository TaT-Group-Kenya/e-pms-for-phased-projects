<?php

namespace App\Http\Resources;

class CustPaymentAllocationResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'payment_id' => $this->payment_id,
            'invoice_id' => $this->invoice_id,
            'allocated_amount' => (float) $this->allocated_amount,
            'allocation_date' => $this->formatTimestamp($this->allocation_date),
            'balance_before_payment' => $this->balance_before_payment,
            'balance_after_payment' => $this->balance_after_payment,
            'installment_number' => $this->installment_number,
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,

            'payment' => new CustPaymentResource($this->whenLoaded('payment')),

            'invoice' => new CustInvoiceResource($this->whenLoaded('invoice')),

        ];
    }
}
