<?php

namespace App\Http\Resources\Reporting;

use Illuminate\Http\Resources\Json\JsonResource;

class OrdersSummaryResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'order_number' => $this->order_number,
            'project' => $this->project ? $this->project->name : null,
            'customer_id' => $this->customer_id,
            'customer_name' => optional($this->customer)->name,
            'job_reference_id' => $this->job_reference_id,
            'quotation_id' => $this->quotation_id,
            'quotation_title' => optional($this->quotation)->title,
            'title' => $this->title,
            'status' => $this->status,
            'total_amount' => $this->total_amount,
            'currency' => $this->currency,
            'created_at' => $this->created_at,
        ];
    }
}
