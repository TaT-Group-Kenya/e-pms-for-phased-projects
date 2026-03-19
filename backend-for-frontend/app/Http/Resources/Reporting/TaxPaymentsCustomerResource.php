<?php

namespace App\Http\Resources\Reporting;

use Illuminate\Http\Resources\Json\JsonResource;

class TaxPaymentsCustomerResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'transaction_number' => $this->transaction_number,
            'tax_amount' => $this->tax_amount ?? 0,
            'converted_tax_amount' => $this->converted_tax_amount ?? 0,
            'exchange_rate' => $this->exchange_rate ?? 1,
            'currency' => $this->transaction_currency,
            'invoice_number' => $this->invoice_number ?? null,
            'customer_name' => $this->customer_name ?? null,
            'created_at' => $this->created_at,
        ];
    }
}
