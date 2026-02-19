<?php

namespace App\Services;

use App\Models\CustInvoiceDocument;

class CustInvoiceDocumentService
{
    public function index(
        array $filters = [],
        int $perPage = 15,
        array $with = []
    ) {
        // optimized query: apply eager loading and simple filters
        $query = CustInvoiceDocument::query();
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
        $query = CustInvoiceDocument::query();
        if (!empty($with)) $query->with($with);
        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return CustInvoiceDocument::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = CustInvoiceDocument::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete(int $id)
    {
        return CustInvoiceDocument::destroy($id);
    }
}