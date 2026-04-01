<?php

namespace App\Http\Resources\Dashboard;

use App\Http\Resources\BaseResource;

class ProjectsProgressOverviewResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'new' => $this->resource['new'] ?? 0,
            'progress' => $this->resource['progress'] ?? 0,
            'draft' => $this->resource['draft'] ?? 0,
            'complete' => $this->resource['complete'] ?? 0,
        ];
    }
}
