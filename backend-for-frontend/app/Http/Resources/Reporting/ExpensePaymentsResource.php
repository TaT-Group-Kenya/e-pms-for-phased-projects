<?php

namespace App\Http\Resources\Reporting;

use Illuminate\Http\Resources\Json\JsonResource;

class ExpensePaymentsResource extends JsonResource
{
    public function toArray($request)
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
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'expense_description' => $this->expense_description ?? null,
            'category_name' => $this->category_name ?? null,
            'cost_center_name' => $this->cost_center_name ?? null,
            'expense_status' => $this->expense_status ?? null,
            'source_account_name' => $this->source_account_name ?? null,
            'narration' => $this->narration ?? null,
            'amount' => $this->amount ?? null,
        ];
    }
}
