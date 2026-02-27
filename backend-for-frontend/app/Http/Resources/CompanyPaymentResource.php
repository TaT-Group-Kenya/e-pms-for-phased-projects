<?php

namespace App\Http\Resources;

class CompanyPaymentResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'transaction_id' => $this->transaction_id,
            'invoice_id' => $this->invoice_id,
            'amount_paid' => (float) $this->amount_paid,
            'payment_date' => $this->formatTimestamp($this->payment_date),
            'payment_method' => $this->payment_method,
            'payment_status' => $this->payment_status,
            'currency' => $this->currency,
            'exchange_rate' => (float) $this->exchange_rate,
            'bank_name' => $this->bank_name,
            'check_number' => $this->check_number,
            'transaction_reference' => $this->transaction_reference,
            'receipt_number' => $this->receipt_number,
            'reconciled' => $this->reconciled,
            'reconciliation_date' => $this->formatTimestamp($this->reconciliation_date),
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,

            'invoice' => new CompanyInvoiceResource($this->whenLoaded('invoice')),

            'transaction' => new TransactionResource($this->whenLoaded('transaction')),

        ];
    }
}
