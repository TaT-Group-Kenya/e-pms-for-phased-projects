<?php

namespace App\Http\Resources\Dashboard;

use App\Http\Resources\BaseResource;

class PendingCustInvoicesResource extends BaseResource
{
    public function toArray($request): array
    {
        return $this->resource;
    }
}
