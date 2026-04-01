<?php

namespace App\Http\Resources\Dashboard;

use App\Http\Resources\BaseResource;

class CurrencyPreferenceResource extends BaseResource
{
    public function toArray($request): array
    {
        // $this->resource is an associative array: ['KES' => 10, 'USD' => 5, ...]
        return $this->resource;
    }
}
