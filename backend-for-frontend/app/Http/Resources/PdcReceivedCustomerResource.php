<?php

namespace App\Http\Resources;

class PdcReceivedCustomerResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'transaction_number' => $this->transaction_number,
            'customer_id' => $this->customer_id,
            'customer' => $this->whenLoaded('customer', new CustomerResource($this->customer)),
            'invoice_id' => $this->invoice_id,
            'invoice' => $this->whenLoaded('invoice', new CustInvoiceResource($this->invoice)),
            'cheque_number' => $this->cheque_number,
            'cheque_date' => $this->formatTimestamp($this->cheque_date),
            'received_date' => $this->formatTimestamp($this->received_date),
            'amount' => $this->amount,
            'currency' => $this->currency,
            'bank' => $this->bank,
            'bank_branch' => $this->bank_branch,
            'bank_account_id' => $this->bank_account_id,
            'bank_account' => $this->whenLoaded('bankAccount', new AccountResource($this->bankAccount)),
            'customer_name' => $this->customer?->name ?? null,
            'invoice_number' => $this->invoice?->invoice_number ?? null,
            'status' => $this->status,
            'narration' => $this->narration,
            'related_transaction_id' => $this->related_transaction_id,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_by_user' => new UserResource($this->whenLoaded('createdByUser')),
            'updated_by_user' => new UserResource($this->whenLoaded('updatedByUser')),
        ];
    }
}
