<?php

namespace App\Http\Resources\Dashboard;

use App\Http\Resources\BaseResource;

class ProjectsAnalysisResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'categories' => $this->resource['categories'] ?? [],
            'series' => $this->resource['series'] ?? [],
        ];
    }
}
