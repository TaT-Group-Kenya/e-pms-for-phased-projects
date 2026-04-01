<?php

namespace App\Services;

use App\Models\OfficeExpenseCategory;

class OfficeExpenseCategoryService
{
    public function index(array $filters = [], int $perPage = 15, int $page = 1)
    {
        $query = OfficeExpenseCategory::query();
        foreach ($filters as $key => $value) {
            $query->where($key, $value);
        }
        $query->orderByDesc('id');
        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function find(int $id)
    {
        return OfficeExpenseCategory::findOrFail($id);
    }

    public function create(array $data)
    {
        return OfficeExpenseCategory::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = OfficeExpenseCategory::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete(int $id)
    {
        $model = OfficeExpenseCategory::findOrFail($id);
        return $model->delete();
    }
}
