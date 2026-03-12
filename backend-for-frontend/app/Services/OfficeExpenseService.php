<?php

namespace App\Services;

use App\Models\OfficeExpense;

class OfficeExpenseService
{
    public function index(array $filters = [], int $perPage = 15, int $page = 1)
    {
        $query = OfficeExpense::query();
        foreach ($filters as $key => $value) {
            $query->where($key, $value);
        }
        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function find(int $id)
    {
        return OfficeExpense::findOrFail($id);
    }

    public function create(array $data)
    {
        return OfficeExpense::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = OfficeExpense::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete(int $id)
    {
        $model = OfficeExpense::findOrFail($id);
        return $model->delete();
    }
}
