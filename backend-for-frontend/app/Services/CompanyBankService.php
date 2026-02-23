<?php

namespace App\Services;

use App\Models\CompanyBank;

class CompanyBankService
{
    public function index(
        array $filters = [],
        int $perPage = 15,
        int $page = 1,
        int $offset = 0,
        array $with = []
    ) {
        // optimized query: apply eager loading and simple filters
        $query = CompanyBank::query();
        if (!empty($with)) {
            $query->with($with);
        }
        foreach ($filters as $key => $value) {
            $query->where($key, $value);
        }
        
        // Calculate offset if page is provided, otherwise use explicit offset
        $calculatedOffset = $page > 1 ? ($page - 1) * $perPage + $offset : $offset;
        
        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function find(int $id, array $with = [])
    {
        $query = CompanyBank::query();
        if (!empty($with)) $query->with($with);
        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return CompanyBank::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = CompanyBank::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete(int $id)
    {
        return CompanyBank::destroy($id);
    }
}