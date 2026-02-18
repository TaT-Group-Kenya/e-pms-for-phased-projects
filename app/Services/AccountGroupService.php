<?php

namespace App\Services;

use App\Models\AccountGroup;

class AccountGroupService
{
    public function index(
        array $filters = [],
        int $perPage = 15,
        array $with = []
    ) {
        $query = AccountGroup::query();
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
        $query = AccountGroup::query();
        if (!empty($with)) $query->with($with);
        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return AccountGroup::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = AccountGroup::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete(int $id)
    {
        return AccountGroup::destroy($id);
    }
}
