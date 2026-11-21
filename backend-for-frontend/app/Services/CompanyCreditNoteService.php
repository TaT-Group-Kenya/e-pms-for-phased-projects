<?php

namespace App\Services;

use App\Models\CompanyCreditNote;
use App\Services\Concerns\ListQuery;

class CompanyCreditNoteService
{
    use ListQuery;

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
        $model = CompanyCreditNote::create($data);

        // A raised company credit note reverses recoverable VAT (VAT_OUT).
        TaxTransactionService::syncCompanyCreditNotePosition($model);

        return $model;
    }

    public function update(int $id, array $data)
    {
        // Header amounts are always derived from items
        unset($data['subtotal_amount'], $data['tax_amount'], $data['total_amount']);

        $model = CompanyCreditNote::findOrFail($id);
        $model->update($data);

        TaxTransactionService::syncCompanyCreditNotePosition($model);

        return $model;
    }

    public function delete(int $id, ?int $deletedBy = null)
    {
        $model = CompanyCreditNote::findOrFail($id);

        $result = $model->softDelete($deletedBy);

        // Deleting a raised credit note withdraws its VAT_OUT position.
        TaxTransactionService::syncCompanyCreditNotePosition($model);

        return $result;
    }
}
