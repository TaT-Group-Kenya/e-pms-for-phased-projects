<?php

namespace App\Http\Resources\Dashboard;

use App\Http\Resources\BaseResource;

class ProjectsRoadmapResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->resource['id'],
            'job_reference_id' => $this->resource['job_reference_id'],
            'name' => $this->resource['name'],
            'progress' => $this->resource['progress'],
        ];
    }
}
