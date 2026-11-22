<?php

namespace App\Services;

use App\Models\User;
use App\Services\Concerns\ListQuery;

class UserService
{
    use ListQuery;

    /** Columns matched by the free-text `search` parameter. */
    protected array $listSearchable = [
        'first_name',
        'middle_name',
        'last_name',
        'email',
    ];

    /** Columns the request may filter on with equality. */
    protected array $listFilterable = [
        'category',
        'is_active',
        'company_id',
        'customer_id',
    ];

    public function index(
        array $filters = [],
        int $perPage = 15,
        int $page = 1,
        int $offset = 0,
        array $with = []
    ) {
        $query = User::query();
        if (! empty($with)) {
            $query->with($with);
        }

        // Logical-deletion visibility flags
        $query = $this->applyLogicalDeletion($query, $filters);

        return $this->paginateList($query, $filters, $perPage, $page);
    }

    public function find(int $id, array $with = [])
    {
        $query = User::query();
        if (! empty($with)) {
            $query->with($with);
        }

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

        if (! $result) {
            throw new \Exception('Failed to update user in database');
        }

        // Refresh the model to get the latest data from database
        $model->refresh();

        return $model;
    }

    public function delete(int $id, ?int $deletedBy = null)
    {
        $model = User::findOrFail($id);

        return $model->softDelete($deletedBy);
    }
}
