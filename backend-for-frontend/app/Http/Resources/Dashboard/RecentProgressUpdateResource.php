<?php

namespace App\Http\Resources\Dashboard;

use App\Http\Resources\BaseResource;

class RecentProgressUpdateResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->resource['id'],
            'project_id' => $this->resource['project_id'],
            'job_reference_id' => $this->resource['job_reference_id'],
            'project_name' => $this->resource['project_name'],
            'phase_name' => $this->resource['phase_name'],
            'comment' => $this->resource['comment'],
            'percentage_complete' => $this->resource['percentage_complete'],
            'updated_at' => $this->formatTimestamp($this->resource['updated_at'] ?? null),
        ];
    }
}
