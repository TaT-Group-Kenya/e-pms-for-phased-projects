<?php

namespace App\Services;

use App\Models\CompanyInvoiceTaxItem;

class CompanyInvoiceTaxItemService
{
    public function index(
        array $filters = [],
        int $perPage = 15,
        array $with = []
    ) {
        // optimized query: apply eager loading and simple filters
        $query = CompanyInvoiceTaxItem::query();
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
        $query = CompanyInvoiceTaxItem::query();
        if (!empty($with)) $query->with($with);
        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return CompanyInvoiceTaxItem::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = CompanyInvoiceTaxItem::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete(int $id)
    {
        return CompanyInvoiceTaxItem::destroy($id);
    }
}