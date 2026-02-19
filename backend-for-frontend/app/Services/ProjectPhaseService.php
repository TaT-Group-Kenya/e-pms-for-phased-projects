<?php

namespace App\Services;

use App\Models\ProjectPhase;

class ProjectPhaseService
{
    public function index(
        array $filters = [],
        int $perPage = 15,
        array $with = []
    ) {
        // optimized query: apply eager loading and simple filters
        $query = ProjectPhase::query();
        if (!empty($with)) {
            $query->with($with);
        }
        foreach ($filters as $key => $value) {
            $query->where($key, $value);
        }
        return $query->paginate($perPage);
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
}