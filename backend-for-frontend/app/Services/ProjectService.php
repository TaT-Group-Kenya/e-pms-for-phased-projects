<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Project;
use App\Models\ProjectPhase;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ProjectService
{
    public function index(
        array $filters = [],
        int $perPage = 15,
        int $page = 1,
        int $offset = 0,
        array $with = ['customer', 'order', 'creator']
    ) {
        // optimized query: apply eager loading and simple filters
        $query = Project::query();
        if (! empty($with)) {
            $query->with($with);
        }
        // Handle soft-delete visibility flags
        $withDeleted = filter_var($filters['with_deleted'] ?? null, FILTER_VALIDATE_BOOLEAN);
        $onlyDeleted = filter_var($filters['only_deleted'] ?? null, FILTER_VALIDATE_BOOLEAN);

        unset($filters['with_deleted'], $filters['only_deleted']);

        if ($onlyDeleted) {
            $query->onlyDeleted();
        } elseif ($withDeleted) {
            $query->withDeleted();
        }

        foreach ($filters as $key => $value) {
            $query->where($key, $value);
        }
        $query->orderByDesc('id');

        // Calculate offset if page is provided, otherwise use explicit offset
        $calculatedOffset = $page > 1 ? ($page - 1) * $perPage + $offset : $offset;

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function find(int $id, array $with = [])
    {
        $query = Project::query();
        if (! empty($with)) {
            $query->with($with);
        }

        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            if (! empty($data['order_id'])) {
                $containerNumbers = Order::with('shipContainer.numbers')
                    ->find($data['order_id'])
                    ?->shipContainer?->numbers
                    ->pluck('container_no')
                    ->filter()
                    ->values()
                    ->implode(', ');
                $data['container_numbers'] = $containerNumbers ?: null;
            }

            // Handle automatic phase creation based on no_of_phases
            $noOfPhases = (int) $data['no_of_phases'];
            if (($data['status'] ?? null) === 'complete' && $noOfPhases === 1) {
                throw ValidationException::withMessages([
                    'status' => ['A project with an automatically created phase cannot be completed until that phase has an entry number.'],
                ]);
            }

            $project = Project::create($data);
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

            if (($data['status'] ?? null) === 'complete') {
                $hasPhaseMissingEntry = $model->phases()->where(function ($query) {
                    $query->whereNull('entry_number')->orWhereRaw("TRIM(entry_number) = ''");
                })->exists();
                $willCreateCompletedPhase = ! $model->phases()->exists() && $newNoOfPhases === 1;

                if ($hasPhaseMissingEntry || $willCreateCompletedPhase) {
                    throw ValidationException::withMessages([
                        'status' => ['Every project phase needs an entry number before the project can be completed.'],
                    ]);
                }
            }

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
                    // Multiple phases exist and project is draft, logically delete all and create one
                    $deletedBy = $model->updated_by ?? $model->created_by;

                    $model->phases()->get()->each(function (ProjectPhase $phase) use ($deletedBy) {
                        $phase->softDelete($deletedBy);
                    });

                    $this->createPhaseFromProject($model);
                }
                // If multiple phases and project is not draft, do nothing
            } elseif ($newNoOfPhases > 1) {
                // If phases are more than 1, don't manage phases automatically
            }

            return $model;
        });
    }

    public function delete(int $id, ?int $deletedBy = null)
    {
        return DB::transaction(function () use ($id, $deletedBy) {
            $model = Project::findOrFail($id);

            return $model->softDelete($deletedBy);
        });
    }

    /**
     * Create a project phase from project data
     */
    private function createPhaseFromProject(Project $project)
    {
        $phaseDetails = $this->getPhaseDetails($project);

        // Project/order linkage uses the project's order_id during phase creation.
        $containerNumbers = $phaseDetails['container_numbers'];

        // Generate unique project phase code
        $code = $this->generateUniquePhaseCode();

        ProjectPhase::create([
            'project_id' => $project->id,
            'code' => $code,
            'name' => $phaseDetails['name'],
            'description' => $phaseDetails['description'],
            'container_numbers' => $containerNumbers,
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
     * Resolve linked container details through the order_id assigned when the project is created.
     */
    private function getPhaseDetails(Project $project): array
    {
        $order = $project->order_id
            ? Order::with('shipContainer.numbers')->find($project->order_id)
            : null;
        $containerNumbers = $order?->shipContainer?->numbers
            ->pluck('container_no')
            ->filter()
            ->values()
            ->all() ?? [];
        $containerNumbersList = implode(', ', $containerNumbers);
        $phaseName = $project->name;
        $phaseDescription = $project->description;

        if ($containerNumbersList !== '') {
            $phaseName .= ' - '.$containerNumbersList;
            $phaseDescription = trim(($phaseDescription ? $phaseDescription.' ' : '').'Container numbers: '.$containerNumbersList);
        }

        return [
            'container_numbers' => $containerNumbersList ?: null,
            'name' => $phaseName,
            'description' => $phaseDescription,
        ];
    }

    /**
     * Update the existing phase with project data
     */
    private function updatePhaseFromProject(Project $project)
    {
        $phase = $project->phases()->first();
        if ($phase) {
            $phaseDetails = $this->getPhaseDetails($project);
            $phase->update([
                'name' => $phaseDetails['name'],
                'description' => $phaseDetails['description'],
                'container_numbers' => $phaseDetails['container_numbers'],
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
        $commonService = new CommonService;
        do {
            $code = $commonService->generateUniqueCode($prefix);
        } while (ProjectPhase::where('code', $code)->exists());

        return $code;
    }
}
