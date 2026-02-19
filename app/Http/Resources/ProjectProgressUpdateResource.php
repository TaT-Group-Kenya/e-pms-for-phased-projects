<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProjectProgressUpdateResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'project_id' => $this->project_id,
            'project_phase_id' => $this->project_phase_id,
            'percentage_complete' => $this->percentage_complete,
            'updated_at' => $this->updated_at?->toISOString(),
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at?->toISOString(),
            'created_by' => $this->created_by,

            'project' => new ProjectResource($this->whenLoaded('project')),

            'projectPhase' => new ProjectPhaseResource($this->whenLoaded('projectPhase')),

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
