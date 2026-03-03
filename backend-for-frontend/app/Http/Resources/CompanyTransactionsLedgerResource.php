<?php

namespace App\Http\Resources;

class CompanyTransactionsLedgerResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'company_payment_id' => $this->company_payment_id,
            'transaction_number' => $this->transaction_number,
            'transaction_type' => $this->transaction_type,
            'transaction_date' => $this->transaction_date,
            'posted_date' => $this->posted_date,
            'amount' => (float) $this->amount,
            'transaction_currency' => $this->transaction_currency,
            'base_currency' => $this->base_currency,
            'exchange_rate' => (float) $this->exchange_rate,
            'converted_amount' => (float) $this->converted_amount,
            'converted_tax_amount' => (float) ($this->converted_tax_amount ?? 0),
            'converted_net_amount' => (float) ($this->converted_net_amount ?? 0),
            'tax_amount' => (float) $this->tax_amount,
            'net_amount' => (float) $this->net_amount,
            'company_id' => $this->company_id,
            'customer_id' => $this->customer_id,
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
            'created_at' => $this->formatTimestamp($this->created_at),
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'is_deleted' => (bool) $this->is_deleted,
            'deleted_at' => $this->formatTimestamp($this->deleted_at),
            'deleted_by' => $this->deleted_by,

            'payment' => new CompanyPaymentResource($this->whenLoaded('payment')),
            'company' => new CompanyResource($this->whenLoaded('company')),
            'customer' => new CustomerResource($this->whenLoaded('customer')),
        ];
    }
}
