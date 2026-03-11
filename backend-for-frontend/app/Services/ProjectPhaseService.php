<?php

namespace App\Services;

use App\Models\ProjectPhase;

class ProjectPhaseService
{
    public function index(
        array $filters = [],
        int $perPage = 15,
        int $page = 1,
        int $offset = 0,
        array $with = []
    ) {
        // optimized query: apply eager loading and simple filters
        $query = ProjectPhase::query();
        if (!empty($with)) {
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
        
        // Calculate offset if page is provided, otherwise use explicit offset
        $calculatedOffset = $page > 1 ? ($page - 1) * $perPage + $offset : $offset;
        
        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function find(int $id, array $with = [])
    {
        $query = ProjectPhase::query();
        if (!empty($with)) $query->with($with);
        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return ProjectPhase::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = ProjectPhase::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete(int $id)
    {
        return ProjectPhase::destroy($id);
    }

    /**
     * Generate unique project phase code with format PRP-XXXX-XXXX (numeric)
    */
    public function generateUniquePhaseCode($prefix = 'PRP-'): string
    {
        do {
            $code = $prefix . str_pad(mt_rand(0, 9999), 4, '0', STR_PAD_LEFT) . '-' . str_pad(mt_rand(0, 9999), 4, '0', STR_PAD_LEFT);
        } while (ProjectPhase::where('code', $code)->exists());
        
        return $code;
    }
}