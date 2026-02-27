<?php

namespace App\Services;

use App\Models\OrderTaxItem;

class OrderTaxItemService
{
    public function index(
        array $filters = [],
        int $perPage = 15,
        array $with = []
    ) {
        $query = OrderTaxItem::query();

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
        $query = OrderTaxItem::query();

        if (!empty($with)) {
            $query->with($with);
        }

        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return OrderTaxItem::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = OrderTaxItem::findOrFail($id);
        $model->update($data);

        return $model;
    }

    public function delete(int $id)
    {
        return OrderTaxItem::destroy($id);
    }
}
