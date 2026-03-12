<?php

namespace App\Services;

use App\Models\CustomerTransactionsLedger;

class CustomerTransactionsLedgerService
{
    public function index(
        array $filters = [],
        int $perPage = 15,
        int $page = 1,
        int $offset = 0,
        array $with = []
    ) {
        $query = CustomerTransactionsLedger::query();

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

        $calculatedOffset = $page > 1 ? ($page - 1) * $perPage + $offset : $offset;

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function find(int $id, array $with = [])
    {
        $query = CustomerTransactionsLedger::query();
        if (!empty($with)) {
            $query->with($with);
        }

        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return CustomerTransactionsLedger::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = CustomerTransactionsLedger::findOrFail($id);
        $model->update($data);

        return $model;
    }

    public function delete(int $id, ?int $deletedBy = null)
    {
        $model = CustomerTransactionsLedger::findOrFail($id);

        return $model->softDelete($deletedBy);
    }
}
