<?php

namespace App\Services;

use App\Models\OfficeExpensePayment;

class OfficeExpensePaymentService
{
    public function index(array $filters = [], int $perPage = 15, int $page = 1)
    {
        $query = OfficeExpensePayment::query();
        foreach ($filters as $key => $value) {
            $query->where($key, $value);
        }
        $query->orderByDesc('id');
        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function find(int $id)
    {
        return OfficeExpensePayment::findOrFail($id);
    }

    public function create(array $data)
    {
        return OfficeExpensePayment::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = OfficeExpensePayment::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete(int $id)
    {
        $model = OfficeExpensePayment::findOrFail($id);
        return $model->delete();
    }
}
