<?php

namespace App\Services;

use App\Services\Concerns\ListQuery;
use App\Models\CompanyPayment;

class CompanyPaymentService
{
    use ListQuery;

    /** Business date column used by the `date_from`/`date_to` range filters. */
    protected string $listDateColumn = 'payment_date';

    /** Columns matched by the free-text `search` parameter. */
    protected array $listSearchable = [
        'receipt_number',
        'transaction_reference',
        'check_number',
        'bank_name',
    ];

    /** Columns the request may filter on with equality. */
    protected array $listFilterable = [
        'payment_method',
        'payment_status',
        'currency',
        'invoice_id',
    ];

    public function index(
        array $filters = [],
        int $perPage = 15,
        int $page = 1,
        int $offset = 0,
        array $with = []
    ) {
        // optimized query: apply eager loading, search and whitelisted filters
        $query = CompanyPayment::query();
        if (! empty($with)) {
            $query->with($with);
        }

        // Logical-deletion visibility flags
        $query = $this->applyLogicalDeletion($query, $filters);

        // Payables listing is always normal receipts from this controller
        $query->where('transaction_type', 'receipt');
        $query->where('payment_type', 'normal');

        return $this->paginateList($query, $filters, $perPage, $page);
    }

    public function find(int $id, array $with = [])
    {
        $query = CompanyPayment::query();
        if (! empty($with)) {
            $query->with($with);
        }

        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return CompanyPayment::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = CompanyPayment::findOrFail($id);
        $model->update($data);

        return $model;
    }

    public function delete(int $id, ?int $deletedBy = null)
    {
        $model = CompanyPayment::findOrFail($id);

        return $model->softDelete($deletedBy);
    }
}
