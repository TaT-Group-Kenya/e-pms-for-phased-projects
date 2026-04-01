<?php

namespace App\Http\Resources\Reporting;

use Illuminate\Http\Resources\Json\JsonResource;

class OrdersSummaryResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'created_at' => $this->created_at,
            'job_reference_id' => $this->job_reference_id,
            'customer_name' => optional($this->customer)->name,
            'title' => $this->title,
            'currency' => $this->currency,
            'total_amount' => $this->total_amount,
            'status' => $this->status,
            'created_by_name' => optional($this->creator)->first_name || optional($this->creator)->last_name
                ? trim((string) optional($this->creator)->first_name . ' ' . (string) optional($this->creator)->last_name)
                : (optional($this->creator)->email ?? null),
        ];
    }
}
