<?php

namespace App\Services;

use App\Models\QuoteApproval;

class QuoteApprovalService
{
    public function index(
        array $filters = [],
        int $perPage = 15,
        int $page = 1,
        int $offset = 0,
        array $with = []
    ) {
        $query = QuoteApproval::query();
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
        $query = QuoteApproval::query();
        if (!empty($with)) {
            $query->with($with);
        }
        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return QuoteApproval::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = QuoteApproval::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete(int $id)
    {
        return QuoteApproval::destroy($id);
    }
}
