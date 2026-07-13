<?php

namespace App\Http\Resources;

class CompanyPaymentResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'transaction_number' => $this->transaction_number,
            'transaction_type' => $this->transaction_type,
            'direction' => $this->direction,
            'invoice_id' => $this->invoice_id,
            'amount_paid' => (float) $this->amount_paid,
            'tax_amount' => (float) $this->tax_amount,
            'net_amount' => (float) $this->net_amount,
            'payment_date' => $this->formatTimestamp($this->payment_date),
            'payment_method' => $this->payment_method,
            'payment_status' => $this->payment_status,
            'currency' => $this->currency,
            'exchange_rate' => (float) $this->exchange_rate,
            'forex_rate' => $this->forex_rate !== null ? (float) $this->forex_rate : null,
            'settlement_account_forex_rate' => $this->settlement_account_forex_rate !== null ? (float) $this->settlement_account_forex_rate : null,
            'transaction_cost' => $this->transaction_cost !== null ? (float) $this->transaction_cost : null,
            'project_currency_value' => $this->project_currency_value !== null ? (float) $this->project_currency_value : null,
            'project_currency' => $this->project_currency,
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
            'created_by_user' => new UserResource($this->whenLoaded('createdByUser')),
            'ledger_entries' => CompanyTransactionsLedgerResource::collection($this->whenLoaded('companyLedgerEntries')),
        ];
    }
}
