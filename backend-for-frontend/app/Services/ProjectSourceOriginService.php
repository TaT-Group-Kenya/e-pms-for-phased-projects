<?php

namespace App\Services;

use App\Models\ProjectSourceOrigin;

class ProjectSourceOriginService
{
    public function index(
        array $filters = [],
        int $perPage = 15,
        int $page = 1,
        int $offset = 0,
        array $with = []
    ) {
        $query = ProjectSourceOrigin::query();
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
        $query = ProjectSourceOrigin::query();
        if (!empty($with)) $query->with($with);
        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return ProjectSourceOrigin::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = ProjectSourceOrigin::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete(int $id)
    {
        return ProjectSourceOrigin::destroy($id);
    }
}
