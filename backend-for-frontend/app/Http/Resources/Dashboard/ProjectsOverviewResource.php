<?php

namespace App\Http\Resources\Dashboard;

use App\Http\Resources\BaseResource;

class ProjectsOverviewResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'total_projects' => $this->resource['total_projects'] ?? null,
            'active_projects' => $this->resource['active_projects'] ?? null,
            'finished_projects' => $this->resource['finished_projects'] ?? null,
            'orders_count' => $this->resource['orders_count'] ?? null,
        ];
    }
}
