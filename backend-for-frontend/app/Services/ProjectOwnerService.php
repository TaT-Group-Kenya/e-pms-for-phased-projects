<?php

namespace App\Services;

use App\Models\ProjectOwner;

class ProjectOwnerService
{
    public function index(
        array $filters = [],
        int $perPage = 15,
        int $page = 1,
        int $offset = 0,
        array $with = []
    ) {
        // optimized query: apply eager loading and simple filters
        $query = ProjectOwner::query();

        // Include projects count for each project owner
        $query->withCount('projects');
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
        $query->orderByDesc('id');
        
        // Calculate offset if page is provided, otherwise use explicit offset
        $calculatedOffset = $page > 1 ? ($page - 1) * $perPage + $offset : $offset;
        
        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function find(int $id, array $with = [])
    {
        $query = ProjectOwner::query();
        if (!empty($with)) $query->with($with);
        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return ProjectOwner::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = ProjectOwner::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete(int $id, ?int $deletedBy = null)
    {
        $model = ProjectOwner::findOrFail($id);

        return $model->softDelete($deletedBy);
    }
}