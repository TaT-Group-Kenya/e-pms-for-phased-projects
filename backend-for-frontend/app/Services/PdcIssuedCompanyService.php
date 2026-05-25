<?php

namespace App\Services;

use App\Models\PdcIssuedCompany;

class PdcIssuedCompanyService
{
    public function index(array $filters = [], int $perPage = 15, int $page = 1, int $offset = 0, array $with = [])
    {
        $query = PdcIssuedCompany::query();
        if (!empty($with)) $query->with($with);

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

        return $query->orderByDesc('id')->paginate($perPage, ['*'], 'page', $page);
    }

    public function find(int $id, array $with = [])
    {
        $query = PdcIssuedCompany::query();
        if (!empty($with)) $query->with($with);
        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return PdcIssuedCompany::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = PdcIssuedCompany::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete(int $id)
    {
        $model = PdcIssuedCompany::findOrFail($id);
        return $model->softDelete();
    }
}
