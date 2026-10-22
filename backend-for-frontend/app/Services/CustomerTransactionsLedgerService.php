<?php

namespace App\Services;

use App\Services\Concerns\ListQuery;
use App\Models\CustomerTransactionsLedger;

class CustomerTransactionsLedgerService
{
    use ListQuery;

    /** Business date column used by the `date_from`/`date_to` range filters. */
    protected string $listDateColumn = 'posted_date';

    /** Columns matched by the free-text `search` parameter. */
    protected array $listSearchable = [
        'transaction_number',
        'category',
    ];

    /** Columns the request may filter on with equality. */
    protected array $listFilterable = [
        'transaction_type',
        'transaction_status',
        'customer_id',
        'base_currency',
        'transaction_currency',
        'category',
    ];

    public function index(
        array $filters = [],
        int $perPage = 15,
        int $page = 1,
        int $offset = 0,
        array $with = []
    ) {
        $query = CustomerTransactionsLedger::query();

        if (! empty($with)) {
            $query->with($with);
        }

        // Logical-deletion visibility flags
        $query = $this->applyLogicalDeletion($query, $filters);

        return $this->paginateList($query, $filters, $perPage, $page);
    }

    public function find(int $id, array $with = [])
    {
        $query = CustomerTransactionsLedger::query();
        if (! empty($with)) {
            $query->with($with);
        }

        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return CustomerTransactionsLedger::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = CustomerTransactionsLedger::findOrFail($id);
        $model->update($data);

        return $model;
    }

    public function delete(int $id, ?int $deletedBy = null)
    {
        $model = CustomerTransactionsLedger::findOrFail($id);

        return $model->softDelete($deletedBy);
    }
}
