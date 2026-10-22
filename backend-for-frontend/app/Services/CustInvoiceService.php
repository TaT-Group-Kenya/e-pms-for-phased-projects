<?php

namespace App\Services;

use App\Models\CustInvoice;
use App\Services\Concerns\ListQuery;

class CustInvoiceService
{
    use ListQuery;

    /** Columns matched by the free-text `search` parameter. */
    protected array $listSearchable = [
        'invoice_number',
        'title',
    ];

    /** Columns the request may filter on with equality. */
    protected array $listFilterable = [
        'customer_id',
        'order_id',
        'status',
    ];

    public function index(
        array $filters = [],
        int $perPage = 15,
        int $page = 1,
        int $offset = 0,
        array $with = []
    ) {
        $query = CustInvoice::query();
        if (! empty($with)) {
            $query->with($with);
        }

        // Logical-deletion visibility flags
        $query = $this->applyLogicalDeletion($query, $filters);

        return $this->paginateList($query, $filters, $perPage, $page);
    }

    public function find(int $id, array $with = [])
    {
        $query = CustInvoice::query();
        if (! empty($with)) {
            $query->with($with);
        }

        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return CustInvoice::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = CustInvoice::findOrFail($id);
        $model->update($data);

        return $model;
    }

    public function delete(int $id)
    {
        return CustInvoice::destroy($id);
    }
}
