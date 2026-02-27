<?php

namespace App\Services;

use App\Models\Project;
use App\Models\ProjectPhase;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class ProjectService
{
    public function index(
        array $filters = [],
        int $perPage = 15,
        int $page = 1,
        int $offset = 0,
        array $with = []
    ) {
        // optimized query: apply eager loading and simple filters
        $query = Project::query();
        if (!empty($with)) {
            $query->with($with);
        }
        foreach ($filters as $key => $value) {
            $query->where($key, $value);
        }
        
        // Calculate offset if page is provided, otherwise use explicit offset
        $calculatedOffset = $page > 1 ? ($page - 1) * $perPage + $offset : $offset;
        
        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function find(int $id, array $with = [])
    {
        $query = Project::query();
        if (!empty($with)) $query->with($with);
        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            $project = Project::create($data);
            
            // Handle automatic phase creation based on no_of_phases
            $noOfPhases = (int) $data['no_of_phases'];
            if ($noOfPhases === 1) {
                $this->createPhaseFromProject($project);
            }
            
            return $project;
        });
    }

    public function update(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $model = Project::findOrFail($id);
            $oldNoOfPhases = (int) $model->no_of_phases;
            $newNoOfPhases = (int) ($data['no_of_phases'] ?? $oldNoOfPhases);
            
            $model->update($data);
            
            // Handle phase operations based on no_of_phases changes
            if ($newNoOfPhases === 1) {
                $existingPhases = $model->phases()->count();
                
                if ($existingPhases === 0) {
                    // No phases exist, create one
                    $this->createPhaseFromProject($model);
                } elseif ($existingPhases === 1) {
                    // Exactly one phase exists, update it
                    $this->updatePhaseFromProject($model);
                } elseif ($existingPhases > 1 && $model->status === 'draft') {
                    // Multiple phases exist and project is draft, delete all and create one
                    $model->phases()->delete();
                    $this->createPhaseFromProject($model);
                }
                // If multiple phases and project is not draft, do nothing
            } elseif ($newNoOfPhases > 1) {
                // If phases are more than 1, don't manage phases automatically
            }
            
            return $model;
        });
    }

    public function delete(int $id)
    {
        return DB::transaction(function () use ($id) {
            return Project::destroy($id);
        });
    }

    /**
     * Create a project phase from project data
     */
    private function createPhaseFromProject(Project $project)
    {
        // Generate unique project phase code
        $code = $this->generateUniquePhaseCode();
        
        ProjectPhase::create([
            'project_id' => $project->id,
            'code' => $code,
            'name' => $project->name,
            'description' => $project->description,
            'phase_order' => '1',
            'status' => $project->status,
            'start_date' => $project->start_date,
            'end_date' => $project->end_date,
            'progress_percentage' => $project->progress,
            'quote_item_id' => null,
            'created_by' => $project->created_by,
            'updated_by' => $project->updated_by,
        ]);
    }

    /**
     * Update the existing phase with project data
     */
    private function updatePhaseFromProject(Project $project)
    {
        $phase = $project->phases()->first();
        if ($phase) {
            $phase->update([
                'name' => $project->name,
                'description' => $project->description,
                'status' => $project->status,
                'start_date' => $project->start_date,
                'end_date' => $project->end_date,
                'quote_item_id' => null,
                'progress_percentage' => $project->progress,
                'updated_by' => $project->updated_by,
            ]);
        }
    }

    private function generateUniquePhaseCode($prefix = 'PRP-')
    {
        $commonService = new CommonService();
        do {
            $code = $commonService->generateUniqueCode($prefix);
        } while (ProjectPhase::where('code', $code)->exists());
        return $code;
    }
}