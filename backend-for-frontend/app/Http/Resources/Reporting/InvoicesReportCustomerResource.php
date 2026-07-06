<?php

namespace App\Http\Resources\Reporting;

use Illuminate\Http\Resources\Json\JsonResource;

class InvoicesReportCustomerResource extends JsonResource
{
    public function toArray($request)
    {
        // Use values calculated in the service
        $paid = $this->paid ?? 0.0;
        $balance = $this->balance ?? max((float) $this->total_amount - $paid, 0.0);

        return [
            'id' => $this->id,
            'date' => $this->created_at,
            'job_reference_id' => $this->job_reference_id ?? null,
            'customer' => $this->customer_name ?? ($this->customer ? $this->customer->name : null),
            'invoice_number' => $this->invoice_number ?? $this->id,
            'project_name' => $this->project_name ?? ($this->project ? $this->project->name : null),
            'currency' => $this->currency,
            'amount' => $this->total_amount,
            'paid' => $paid,
            'balance' => $balance,
            'status' => $this->status,
            'created_by_name' => $this->created_by_name ?? null,
        ];
    }
}
