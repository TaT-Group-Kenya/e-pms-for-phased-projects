<?php

namespace App\Services;

use App\Models\OfficeExpense;
use App\Services\Concerns\ListQuery;

class OfficeExpenseService
{
    use ListQuery;

    /**
     * Columns matched by the free-text `search` parameter. `description`
     * lives on office_expenses; the category name is matched via orWhereHas
     * because the request only carries the office-expense table's columns.
     */
    protected array $listSearchable = [
        'description',
    ];

    /** Columns the request may filter on with equality. */
    protected array $listFilterable = [
        'status',
        'currency',
    ];

    public function index(array $filters = [], int $perPage = 15, int $page = 1)
    {
        $query = OfficeExpense::query();

        // Category-name search extends the column search
        $search = trim((string) ($filters['search'] ?? ''));
        if ($search !== '') {
            $like = '%'.strtolower($search).'%';
            $query->orWhereHas('category', fn ($q) => $q->whereRaw('LOWER(name) LIKE ?', [$like]));
        }

        return $this->paginateList($query, $filters, $perPage, $page);
    }

    public function find(int $id)
    {
        return OfficeExpense::findOrFail($id);
    }

    public function create(array $data)
    {
        return OfficeExpense::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = OfficeExpense::findOrFail($id);
        $model->update($data);

        return $model;
    }

    public function delete(int $id)
    {
        $model = OfficeExpense::findOrFail($id);

        return $model->delete();
    }
}
