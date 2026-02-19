<?php

namespace App\Services;

use App\Models\CompanyInvoiceDucoment;

class CompanyInvoiceDucomentService
{
    public function index(
        array $filters = [],
        int $perPage = 15,
        array $with = []
    ) {
        // optimized query: apply eager loading and simple filters
        $query = CompanyInvoiceDucoment::query();
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
        $query = CompanyInvoiceDucoment::query();
        if (!empty($with)) $query->with($with);
        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return CompanyInvoiceDucoment::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = CompanyInvoiceDucoment::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete(int $id)
    {
        return CompanyInvoiceDucoment::destroy($id);
    }
}