<?php

namespace App\Http\Resources;

class CustPaymentResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'transaction_number' => $this->transaction_number,
            'amount_paid' => (float) $this->amount_paid,
            'tax_amount' => (float) $this->tax_amount,
            'net_amount' => (float) $this->net_amount,
            'payment_date' => $this->formatTimestamp($this->payment_date),
            'payment_method' => $this->payment_method,
            'payment_status' => $this->payment_status,
            'currency' => $this->currency,
            'bank_name' => $this->bank_name,
            'check_number' => $this->check_number,
            'transaction_reference' => $this->transaction_reference,
            'receipt_number' => $this->receipt_number,
            'invoice_total_amount' => (float) $this->invoice_total_amount,
            'exchange_rate' => (float) $this->exchange_rate,
            'fee_or_charge' => (float) $this->fee_or_charge,
            'reconciled' => $this->reconciled,
            'reconciliation_date' => $this->formatTimestamp($this->reconciliation_date),
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,

            'ledger_entries' => CustomerTransactionsLedgerResource::collection($this->whenLoaded('customerLedgerEntries')),

            'allocations' => CustPaymentAllocationResource::collection($this->whenLoaded('allocations')),

            'invoices' => CustInvoiceResource::collection($this->whenLoaded('invoices')),
        ];
    }
}
