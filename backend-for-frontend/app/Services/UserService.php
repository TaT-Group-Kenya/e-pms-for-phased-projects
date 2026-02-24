<?php

namespace App\Services;

use App\Models\User;

class UserService
{
    public function index(
        array $filters = [],
        int $perPage = 15,
        int $page = 1,
        int $offset = 0,
        array $with = []
    ) {
        // optimized query: apply eager loading and simple filters
        $query = User::query();
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
        $query = User::query();
        if (!empty($with)) $query->with($with);
        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return User::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = User::findOrFail($id);
        
        // Perform the update
        $result = $model->update($data);
        
        if (!$result) {
            throw new \Exception('Failed to update user in database');
        }
        
        // Refresh the model to get the latest data from database
        $model->refresh();
        
        return $model;
    }

    public function delete(int $id)
    {
        return User::destroy($id);
    }
}