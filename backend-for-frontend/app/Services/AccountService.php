<?php

namespace App\Services;

use App\Models\Account;

class AccountService
{
    public function index(
        array $filters = [],
        int $perPage = 15,
        array $with = []
    ) {
        $query = Account::query();
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
        $query = Account::query();
        if (!empty($with)) $query->with($with);
        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return Account::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = Account::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete(int $id)
    {
        return Account::destroy($id);
    }
}