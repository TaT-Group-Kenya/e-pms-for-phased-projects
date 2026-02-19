<?php

namespace App\Services;

use App\Models\PaymentMethod;

class PaymentMethodService
{
    public function index(
        array $filters = [],
        int $perPage = 15,
        array $with = []
    ) {
        // optimized query: apply eager loading and simple filters
        $query = PaymentMethod::query();
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
        $query = PaymentMethod::query();
        if (!empty($with)) $query->with($with);
        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return PaymentMethod::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = PaymentMethod::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete(int $id)
    {
        return PaymentMethod::destroy($id);
    }
}