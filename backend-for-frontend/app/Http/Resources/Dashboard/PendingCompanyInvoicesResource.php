<?php

namespace App\Http\Resources\Dashboard;

use App\Http\Resources\BaseResource;

class PendingCompanyInvoicesResource extends BaseResource
{
    public function toArray($request): array
    {
        return $this->resource;
    }
}
