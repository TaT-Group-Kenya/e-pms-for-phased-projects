<?php

namespace App\Services;

use App\Models\PdcReceivedCustomer;

class PdcReceivedCustomerService
{
    use \App\Services\Concerns\ListQuery;

    /** Columns matched by the free-text `search` parameter. */
    protected array $listSearchable = [
        'transaction_number',
        'cheque_number',
        'bank',
        'narration',
    ];

    /** Columns the request may filter on with equality. */
    protected array $listFilterable = [
        'customer_id',
        'invoice_id',
        'status',
        'currency',
        'bank',
    ];

    /** Business date column used by the `date_from`/`date_to` range filters. */
    protected string $listDateColumn = 'cheque_date';

    public function index(array $filters = [], int $perPage = 15, int $page = 1, int $offset = 0, array $with = [])
    {
        $query = PdcReceivedCustomer::query();
        if (! empty($with)) {
            $query->with($with);
        }

        $query = $this->applyLogicalDeletion($query, $filters);

        return $this->paginateList($query, $filters, $perPage, $page);
    }

    public function find(int $id, array $with = [])
    {
        $query = PdcReceivedCustomer::query();
        if (! empty($with)) {
            $query->with($with);
        }

        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return PdcReceivedCustomer::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = PdcReceivedCustomer::findOrFail($id);
        $model->update($data);

        return $model;
    }

    public function delete(int $id)
    {
        $model = PdcReceivedCustomer::findOrFail($id);

        return $model->softDelete();
    }
}
