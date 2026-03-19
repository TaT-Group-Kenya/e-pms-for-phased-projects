<?php

namespace App\Http\Resources\Reporting;

use Illuminate\Http\Resources\Json\JsonResource;

class InvoicesReportResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'invoice_id' => $this->id,
            'invoice_number' => $this->invoice_number ?? $this->id,
            'type' => $this->getTable() === 'company_invoices' ? 'company' : 'customer',
            'status' => $this->status,
            'total_amount' => $this->total_amount,
            'currency' => $this->currency,
            'customer_id' => $this->customer_id ?? null,
            'company_id' => $this->company_id ?? null,
            'customer_name' => $this->customer ? $this->customer->name : null,
            'company_name' => $this->company ? $this->company->name : null,
            'created_at' => $this->created_at,
        ];
    }
}
