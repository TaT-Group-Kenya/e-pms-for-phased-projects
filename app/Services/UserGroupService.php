<?php

namespace App\Services;

use App\Models\UserGroup;

class UserGroupService
{
    public function index(
        array $filters = [],
        int $perPage = 15,
        array $with = []
    ) {
        // optimized query: apply eager loading and simple filters
        $query = UserGroup::query();
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
        $query = UserGroup::query();
        if (!empty($with)) $query->with($with);
        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return UserGroup::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = UserGroup::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete(int $id)
    {
        return UserGroup::destroy($id);
    }
}