<?php

namespace App\Services;

use App\Models\CompanyCreditNoteTaxItem;

class CompanyCreditNoteTaxItemService
{
    public function index(
        array $filters = [],
        int $perPage = 15,
        array $with = []
    ) {
        // optimized query: apply eager loading and simple filters
        $query = CompanyCreditNoteTaxItem::query();
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
        $query = CompanyCreditNoteTaxItem::query();
        if (!empty($with)) $query->with($with);
        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return CompanyCreditNoteTaxItem::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = CompanyCreditNoteTaxItem::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete(int $id)
    {
        return CompanyCreditNoteTaxItem::destroy($id);
    }
}