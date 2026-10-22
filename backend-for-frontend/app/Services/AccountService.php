<?php

namespace App\Services;

use App\Models\Account;
use App\Services\Concerns\ListQuery;

class AccountService
{
    use ListQuery;

    /** Columns matched by the free-text `search` parameter. */
    protected array $listSearchable = [
        'code',
        'name',
    ];

    /** Columns the request may filter on with equality. */
    protected array $listFilterable = [
        'type',
        'group',
        'currency',
        'chart_of_account_id',
    ];

    public function index(
        array $filters = [],
        int $perPage = 15,
        int $page = 1,
        int $offset = 0,
        array $with = []
    ) {
        $query = Account::query();
        if (! empty($with)) {
            $query->with($with);
        }
        $query->with('chartOfAccount');

        // Logical-deletion visibility flags
        $query = $this->applyLogicalDeletion($query, $filters);

        return $this->paginateList($query, $filters, $perPage, $page);
    }

    public function find(int $id, array $with = [])
    {
        $query = Account::query();
        if (! empty($with)) {
            $query->with($with);
        }
        $query->with('chartOfAccount');

        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return Account::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = Account::findOrFail($id);
        $model->update($data);

        return $model;
    }

    public function delete(int $id)
    {
        $model = Account::findOrFail($id);

        return $model->softDelete();
    }
}
