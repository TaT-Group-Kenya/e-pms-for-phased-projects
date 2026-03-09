<?php

namespace App\Http\Resources\Dashboard;

use App\Http\Resources\BaseResource;

class RecentOrderResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->resource['id'],
            'order_number' => $this->resource['order_number'],
            'customer_name' => $this->resource['customer_name'],
            'project_name' => $this->resource['project_name'],
            'total_amount' => $this->resource['total_amount'],
            'currency' => $this->resource['currency'],
            'status' => $this->resource['status'],
            'created_at' => $this->formatTimestamp($this->resource['created_at'] ?? null),
        ];
    }
}
