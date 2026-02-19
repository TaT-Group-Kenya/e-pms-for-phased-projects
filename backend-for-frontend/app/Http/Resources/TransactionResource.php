<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'transaction_number' => $this->transaction_number,
            'transaction_type' => $this->transaction_type,
            'transaction_date' => $this->transaction_date,
            'posted_date' => $this->posted_date,
            'amount' => (float) $this->amount,
            'base_currency' => $this->base_currency,
            'exchange_rate' => (float) $this->exchange_rate,
            'converted_amount' => (float) $this->converted_amount,
            'tax_amount' => (float) $this->tax_amount,
            'net_amount' => (float) $this->net_amount,
            'customer_id' => $this->customer_id,
            'company_id' => $this->company_id,
            'source_type' => $this->source_type,
            'source_id' => $this->source_id,
            'account_debit' => $this->account_debit,
            'account_credit' => $this->account_credit,
            'category' => $this->category,
            'payment_method' => $this->payment_method,
            'bank_account' => $this->bank_account,
            'check_number' => $this->check_number,
            'transaction_status' => $this->transaction_status,
            'related_transaction_id' => $this->related_transaction_id,
            'narration' => $this->narration,
            'is_recurring' => (bool) $this->is_recurring,
            'fiscal_year' => $this->fiscal_year,
            'accounting_period' => $this->accounting_period,
            'is_adjusting_entry' => (bool) $this->is_adjusting_entry,
            'cost_center_id' => $this->cost_center_id,
            
            'customer' => new CustomerResource($this->whenLoaded('customer')),
            'company' => new CompanyResource($this->whenLoaded('company')),
            'paymentMethod' => new PaymentMethodResource($this->whenLoaded('paymentMethod')),
            'costCenter' => new CostCenterResource($this->whenLoaded('costCenter')),
            'relatedTransaction' => new TransactionResource($this->whenLoaded('relatedTransaction')),
            
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
        ];
    }
}