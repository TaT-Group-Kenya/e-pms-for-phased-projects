<?php

namespace App\Services;

use App\Models\CompanyCreditNote;

class CompanyCreditNoteService
{
    use \App\Services\Concerns\ListQuery;

    /** Columns matched by the free-text `search` parameter. */
    protected array $listSearchable = [
        'credit_note_number',
        'title',
        'description',
    ];

    /** Columns the request may filter on with equality. */
    protected array $listFilterable = [
        'invoice_id',
        'status',
        'currency',
    ];

    public function index(
        array $filters = [],
        int $perPage = 15,
        int $page = 1,
        int $offset = 0,
        array $with = []
    ) {
        // optimized query: apply eager loading, search and whitelisted filters
        $query = CompanyCreditNote::query();
        if (! empty($with)) {
            $query->with($with);
        }

        // Logical-deletion visibility flags
        $query = $this->applyLogicalDeletion($query, $filters);

        return $this->paginateList($query, $filters, $perPage, $page);
    }

    public function find(int $id, array $with = [])
    {
        $query = CompanyCreditNote::query();
        if (! empty($with)) {
            $query->with($with);
        }

        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        // Save all validated fields, including amounts
        return CompanyCreditNote::create($data);
    }

    public function update(int $id, array $data)
    {
        // Header amounts are always derived from items
        unset($data['subtotal_amount'], $data['tax_amount'], $data['total_amount']);

        $model = CompanyCreditNote::findOrFail($id);
        $model->update($data);

        return $model;
    }

    public function delete(int $id, ?int $deletedBy = null)
    {
        $model = CompanyCreditNote::findOrFail($id);

        return $model->softDelete($deletedBy);
    }
}
