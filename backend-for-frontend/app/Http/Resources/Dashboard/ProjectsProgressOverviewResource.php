<?php

namespace App\Http\Resources\Dashboard;

use App\Http\Resources\BaseResource;

class ProjectsProgressOverviewResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'categories' => $this->resource['categories'] ?? [],
            'series' => $this->resource['series'] ?? [],
        ];
    }
}
