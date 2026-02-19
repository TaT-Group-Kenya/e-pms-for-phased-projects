<?php

namespace App\Services;

use App\Models\OrderTaxItems;

class OrderTaxItemsService
{
    public function index(
        array $filters = [],
        int $perPage = 15,
        array $with = []
    ) {
        // optimized query: apply eager loading and simple filters
        $query = OrderTaxItems::query();
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
        $query = OrderTaxItems::query();
        if (!empty($with)) $query->with($with);
        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return OrderTaxItems::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = OrderTaxItems::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete(int $id)
    {
        return OrderTaxItems::destroy($id);
    }
}