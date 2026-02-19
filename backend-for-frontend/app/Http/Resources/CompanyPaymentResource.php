<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CompanyPaymentResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'transaction_id' => $this->transaction_id,
            'invoice_id' => $this->invoice_id,
            'amount_paid' => (float) $this->amount_paid,
            'payment_date' => $this->payment_date?->toISOString(),
            'payment_method' => $this->payment_method,
            'payment_status' => $this->payment_status,
            'currency' => $this->currency,
            'exchange_rate' => (float) $this->exchange_rate,
            'bank_name' => $this->bank_name,
            'check_number' => $this->check_number,
            'transaction_reference' => $this->transaction_reference,
            'receipt_number' => $this->receipt_number,
            'reconciled' => $this->reconciled,
            'reconciliation_date' => $this->reconciliation_date?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at?->toISOString(),
            'created_by' => $this->created_by,

            'invoice' => new InvoiceResource($this->whenLoaded('invoice')),

            'transaction' => new TransactionResource($this->whenLoaded('transaction')),

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
