<?php

namespace App\Services;

use App\Models\CompanyInvoice;
use App\Services\Concerns\ListQuery;

class CompanyInvoiceService
{
    use ListQuery;

    /** Columns matched by the free-text `search` parameter. */
    protected array $listSearchable = [
        'invoice_number',
        'title',
    ];

    /** Columns the request may filter on with equality. */
    protected array $listFilterable = [
        'company_id',
        'project_id',
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
        $query = CompanyInvoice::query();
        if (! empty($with)) {
            $query->with($with);
        }

        // Logical-deletion visibility flags
        $query = $this->applyLogicalDeletion($query, $filters);

        return $this->paginateList($query, $filters, $perPage, $page);
    }

    public function find(int $id, array $with = [])
    {
        $query = CompanyInvoice::query();
        if (! empty($with)) {
            $query->with($with);
        }

        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return CompanyInvoice::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = CompanyInvoice::findOrFail($id);
        unset($data['subtotal_amount'], $data['tax_amount'], $data['discount_amount'], $data['total_amount']); // prevent updating these fields
        $model->update($data);

        return $model;
    }

    public function delete(int $id)
    {
        return CompanyInvoice::destroy($id);
    }
}
