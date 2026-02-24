<?php

namespace App\Services;

use App\Models\CompanyProject;

class CompanyProjectService
{
    public function index(
        array $filters = [],
        int $perPage = 15,
        int $page = 1,
        int $offset = 0,
        array $with = []
    ) {
        // optimized query: apply eager loading and simple filters
        $query = CompanyProject::query();
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
        $query = CompanyProject::query();
        if (!empty($with)) $query->with($with);
        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        try {
            return CompanyProject::create($data);
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() === '23505' || str_contains($e->getMessage(), 'UNIQUE constraint failed')) {
                // PostgreSQL and SQLite unique constraint violation
                throw new \Exception('This company has already been assigned to this project phase.', 409);
            } elseif (str_contains($e->getMessage(), 'Duplicate entry')) {
                // MySQL duplicate entry
                throw new \Exception('This company has already been assigned to this project phase.', 409);
            }
            throw $e;
        }
    }

    public function update(int $id, array $data)
    {
        $model = CompanyProject::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete(int $id)
    {
        return CompanyProject::destroy($id);
    }
}