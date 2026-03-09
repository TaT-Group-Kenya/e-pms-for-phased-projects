<?php

namespace App\Http\Resources\Dashboard;

use App\Http\Resources\BaseResource;

class TopCustomerByRevenueResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'customer_id' => $this->resource['customer_id'],
            'name' => $this->resource['name'],
            'email' => $this->resource['email'],
            'total_revenue' => $this->resource['total_revenue'],
        ];
    }
}
