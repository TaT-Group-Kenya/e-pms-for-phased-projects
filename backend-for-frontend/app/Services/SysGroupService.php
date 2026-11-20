<?php

namespace App\Services;

use App\Models\SysGroup;
use App\Services\Concerns\ListQuery;

class SysGroupService
{
    use ListQuery;

    /** Columns matched by the free-text `search` parameter. */
    protected array $listSearchable = [
        'name',
        'description',
    ];

    /** Columns the request may filter on with equality. */
    protected array $listFilterable = [
        'name',
    ];

    public function index(
        array $filters = [],
        int $perPage = 15,
        int $page = 1,
        int $offset = 0,
        array $with = []
    ) {
        $query = SysGroup::query();
        if (! empty($with)) {
            $query->with($with);
        }

        // Logical-deletion visibility flags
        $query = $this->applyLogicalDeletion($query, $filters);

        return $this->paginateList($query, $filters, $perPage, $page, 'name');
    }

    public function find(int $id, array $with = [])
    {
        $query = SysGroup::query();
        if (! empty($with)) {
            $query->with($with);
        }

        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return SysGroup::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = SysGroup::findOrFail($id);
        $model->update($data);

        return $model;
    }

    public function delete(int $id, ?int $deletedBy = null)
    {
        $model = SysGroup::findOrFail($id);

        return $model->softDelete($deletedBy);
    }
}
