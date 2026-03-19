<?php

namespace App\Http\Resources\Reporting;

use Illuminate\Http\Resources\Json\JsonResource;

class InvoicePaymentsResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'transaction_number' => $this->transaction_number,
            'amount' => $this->amount ?? null,
            'tax_amount' => $this->tax_amount ?? 0,
            'net_amount' => $this->net_amount ?? null,
            'currency' => $this->currency,
            'invoice_number' => $this->invoice_number ?? null,
            'customer_id' => $this->customer_id ?? null,
            'company_id' => $this->company_id ?? null,
            'created_at' => $this->created_at,
        ];
    }
}
