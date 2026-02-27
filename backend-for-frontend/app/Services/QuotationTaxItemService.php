<?php

namespace App\Services;

use App\Models\QuotationTaxItem;

class QuotationTaxItemService
{
    public function index(
        array $filters = [],
        int $perPage = 15,
        int $page = 1,
        int $offset = 0,
        array $with = []
    ) {
        $query = QuotationTaxItem::query();
        if (!empty($with)) {
            $query->with($with);
        }

        foreach ($filters as $key => $value) {
            $query->where($key, $value);
        }

        $calculatedOffset = $page > 1 ? ($page - 1) * $perPage + $offset : $offset;

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function find(int $id, array $with = [])
    {
        $query = QuotationTaxItem::query();
        if (!empty($with)) {
            $query->with($with);
        }
        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return QuotationTaxItem::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = QuotationTaxItem::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete(int $id)
    {
        return QuotationTaxItem::destroy($id);
    }
}
