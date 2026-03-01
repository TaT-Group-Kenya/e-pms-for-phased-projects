<?php

namespace App\Services;

use App\Models\ProjectLocation;

class ProjectLocationService
{
    public function index(
        array $filters = [],
        int $perPage = 15,
        int $page = 1,
        int $offset = 0,
        array $with = []
    ) {
        $query = ProjectLocation::query();
        if (!empty($with)) {
            $query->with($with);
        }
        foreach ($filters as $key => $value) {
            $query->where($key, $value);
        }

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function find(int $id, array $with = [])
    {
        $query = ProjectLocation::query();
        if (!empty($with)) $query->with($with);
        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return ProjectLocation::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = ProjectLocation::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete(int $id, ?int $deletedBy = null)
    {
        $model = ProjectLocation::findOrFail($id);

        return $model->softDelete($deletedBy);
    }
}
