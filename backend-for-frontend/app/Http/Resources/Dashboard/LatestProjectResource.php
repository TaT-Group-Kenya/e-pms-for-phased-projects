<?php

namespace App\Http\Resources\Dashboard;

use App\Http\Resources\BaseResource;

class LatestProjectResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->resource['id'],
            'code' => $this->resource['code'],
            'name' => $this->resource['name'],
            'customer_name' => $this->resource['customer_name'],
            'budget_estimate' => $this->resource['budget_estimate'],
            'currency' => $this->resource['currency'],
            'start_date' => $this->formatTimestamp($this->resource['start_date'] ?? null),
            'end_date' => $this->formatTimestamp($this->resource['end_date'] ?? null),
            'status' => $this->resource['status'],
        ];
    }
}
