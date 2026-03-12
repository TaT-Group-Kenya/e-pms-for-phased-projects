<?php

namespace App\Http\Resources;

class CompanyProjectResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'project_id' => $this->project_id,
            'phase_id' => $this->phase_id,
            'company_id' => $this->company_id,
            'is_complete' => (bool) $this->is_complete,
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,

            // Hide budget_estimate in nested project
            'project' => $this->whenLoaded('project', function () {
                $project = $this->project;
                if (!$project) return null;
                $data = (new ProjectResource($project))->toArray(request());
                unset($data['budget_estimate']);
                return $data;
            }),

            'phase' => new ProjectPhaseResource($this->whenLoaded('phase')),

            'company' => new CompanyResource($this->whenLoaded('company')),
        ];
    }
}
