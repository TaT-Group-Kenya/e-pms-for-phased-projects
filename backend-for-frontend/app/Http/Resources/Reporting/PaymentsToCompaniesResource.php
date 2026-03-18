<?php

namespace App\Http\Resources\Reporting;

use Illuminate\Http\Resources\Json\JsonResource;

class PaymentsToCompaniesResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'payment_id' => $this->id,
            'transaction_number' => $this->transaction_number,
            'company_id' => $this->company_id,
            'company_name' => $this->company_name,
            'amount' => $this->amount,
            'total_amount' => $this->total_amount,
            'tax_amount' => $this->tax_amount,
            'net_amount' => $this->net_amount,
            'invoice_number' => $this->invoice_number,
            'currency' => $this->currency,
            'status' => $this->status ?? null,
            'created_at' => $this->created_at,
        ];
    }
}
