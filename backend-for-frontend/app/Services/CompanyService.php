<?php

namespace App\Services;

use App\Models\Company;
use App\Services\Concerns\ListQuery;

class CompanyService
{
    use ListQuery;

    /** Columns matched by the free-text `search` parameter. */
    protected array $listSearchable = [
        'name',
        'email',
        'contact_person_name',
        'phone',
        'kra_pin',
    ];

    /** Columns the request may filter on with equality. */
    protected array $listFilterable = [
        'country',
        'city',
    ];

    public function index(
        array $filters = [],
        int $perPage = 15,
        int $page = 1,
        int $offset = 0,
        array $with = []
    ) {
        // Include projects count for each company (uses assignments relation)
        $query = Company::query()->withCount('assignments');
        if (! empty($with)) {
            $query->with($with);
        }

        // Logical-deletion visibility flags
        $query = $this->applyLogicalDeletion($query, $filters);

        return $this->paginateList($query, $filters, $perPage, $page);
    }

    public function find(int $id, array $with = [])
    {
        $query = Company::query();
        if (! empty($with)) {
            $query->with($with);
        }

        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return Company::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = Company::findOrFail($id);
        $model->update($data);

        return $model;
    }

    public function delete(int $id, ?int $deletedBy = null)
    {
        $model = Company::findOrFail($id);

        return $model->softDelete($deletedBy);
    }
}
