<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OfficeExpensePaymentResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'expense_id' => $this->expense_id,
            'transaction_id' => $this->transaction_id,
            'transaction_number' => $this->transaction_number,
            'direction' => $this->direction,
            'transaction_type' => $this->transaction_type,
            'amount_paid' => (float) $this->amount_paid,
            'tax_amount' => (float) $this->tax_amount,
            'net_amount' => (float) $this->net_amount,
            'payment_date' => $this->payment_date,
            'payment_method' => $this->payment_method,
            'payment_status' => $this->payment_status,
            'currency' => $this->currency,
            'exchange_rate' => $this->exchange_rate,
            'bank_name' => $this->bank_name,
            'check_number' => $this->check_number,
            'transaction_reference' => $this->transaction_reference,
            'receipt_number' => $this->receipt_number,
            'reconciled' => $this->reconciled,
            'reconciliation_date' => $this->reconciliation_date,
            'updated_by' => $this->updated_by,
            'created_by' => $this->created_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'transaction' => new TransactionResource($this->whenLoaded('transaction')),
        ];
    }
}
