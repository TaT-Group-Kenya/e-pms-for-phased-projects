<?php

namespace App\Http\Resources\Reporting;

use Illuminate\Http\Resources\Json\JsonResource;

class TaxPaymentsCompanyResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'transaction_number' => $this->transaction_number,
            'tax_amount' => $this->tax_amount ?? 0,
            'currency' => $this->base_currency,
            'invoice_number' => $this->invoice_number ?? null,
            'company_name' => $this->company_name ?? null,
            'created_at' => $this->created_at,
        ];
    }
}
