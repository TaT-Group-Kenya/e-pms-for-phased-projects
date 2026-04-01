<?php

namespace App\Http\Resources\Reporting;

use Illuminate\Http\Resources\Json\JsonResource;

class MarginPerProjectResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'project_id' => $this['project_id'] ?? null,
            'date' => $this['date'] ?? null,
            'job_reference_id' => $this['job_reference_id'] ?? null,
            'customer' => $this['customer'] ?? null,
            'project_name' => $this['project_name'] ?? null,
            'revenue' => $this['revenue'] ?? 0,
            'cost' => $this['cost'] ?? 0,
            'margin' => $this['margin'] ?? 0,
        ];
    }
}
