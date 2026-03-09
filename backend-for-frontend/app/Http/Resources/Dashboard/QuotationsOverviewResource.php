<?php

namespace App\Http\Resources\Dashboard;

use App\Http\Resources\BaseResource;

class QuotationsOverviewResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'draft' => $this->resource['draft'] ?? 0,
            'sent' => $this->resource['sent'] ?? 0,
            'approved' => $this->resource['approved'] ?? 0,
            'rejected' => $this->resource['rejected'] ?? 0,
        ];
    }
}
