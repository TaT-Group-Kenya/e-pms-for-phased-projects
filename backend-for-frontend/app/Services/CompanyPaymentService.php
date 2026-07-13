<?php

namespace App\Services;

use App\Models\CompanyPayment;

class CompanyPaymentService
{
    public function index(
        array $filters = [],
        int $perPage = 15,
        int $page = 1,
        int $offset = 0,
        array $with = []
    ) {
        // optimized query: apply eager loading and simple filters
        $query = CompanyPayment::query();
        if (!empty($with)) {
            $query->with($with);
        }
        // Handle soft-delete visibility flags
        $withDeleted = filter_var($filters['with_deleted'] ?? null, FILTER_VALIDATE_BOOLEAN);
        $onlyDeleted = filter_var($filters['only_deleted'] ?? null, FILTER_VALIDATE_BOOLEAN);

        unset($filters['with_deleted'], $filters['only_deleted']);

        if ($onlyDeleted) {
            $query->onlyDeleted();
        } elseif ($withDeleted) {
            $query->withDeleted();
        }

        foreach ($filters as $key => $value) {
            $query->where($key, $value);
        }

        $query->where('transaction_type', 'receipt');
        $query->where('payment_type', 'normal');
        $query->orderByDesc('id');
        
        // Calculate offset if page is provided, otherwise use explicit offset
        $calculatedOffset = $page > 1 ? ($page - 1) * $perPage + $offset : $offset;
        
        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function find(int $id, array $with = [])
    {
        $query = CompanyPayment::query();
        if (!empty($with)) $query->with($with);
        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return CompanyPayment::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = CompanyPayment::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete(int $id, ?int $deletedBy = null)
    {
        $model = CompanyPayment::findOrFail($id);

        return $model->softDelete($deletedBy);
    }
}