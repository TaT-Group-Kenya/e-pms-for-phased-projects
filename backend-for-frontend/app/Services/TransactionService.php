<?php

namespace App\Services;

use App\Services\Concerns\ListQuery;
use App\Models\Transaction;

class TransactionService
{
    use ListQuery;

    /** Business date column used by the `date_from`/`date_to` range filters. */
    protected string $listDateColumn = 'transaction_date';

    /** Columns matched by the free-text `search` parameter. */
    protected array $listSearchable = [
        'transaction_number',
        'category',
        'narration',
        'payment_method',
        'check_number',
    ];

    /** Columns the request may filter on with equality. */
    protected array $listFilterable = [
        'transaction_type',
        'transaction_status',
        'base_currency',
        'customer_id',
        'company_id',
        'category',
    ];

    public function index(
        array $filters = [],
        int $perPage = 15,
        int $page = 1,
        int $offset = 0,
        array $with = []
    ) {
        // optimized query: apply eager loading, search and whitelisted filters
        $query = Transaction::query();
        if (! empty($with)) {
            $query->with($with);
        }

        // Logical-deletion visibility flags
        $query = $this->applyLogicalDeletion($query, $filters);

        return $this->paginateList($query, $filters, $perPage, $page);
    }

    public function find(int $id, array $with = [])
    {
        $query = Transaction::query();
        if (! empty($with)) {
            $query->with($with);
        }

        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        // Default FX-related fields when not explicitly provided.
        if (! array_key_exists('transaction_currency', $data) || $data['transaction_currency'] === null) {
            $data['transaction_currency'] = $data['base_currency'] ?? null;
        }

        if (! array_key_exists('converted_tax_amount', $data) || $data['converted_tax_amount'] === null) {
            if (array_key_exists('tax_amount', $data)) {
                $data['converted_tax_amount'] = $data['tax_amount'];
            }
        }

        if (! array_key_exists('converted_net_amount', $data) || $data['converted_net_amount'] === null) {
            if (array_key_exists('net_amount', $data)) {
                $data['converted_net_amount'] = $data['net_amount'];
            }
        }

        return Transaction::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = Transaction::findOrFail($id);

        // Keep FX fields in sync on update when only base values are provided.
        if (! array_key_exists('transaction_currency', $data) && array_key_exists('base_currency', $data)) {
            $data['transaction_currency'] = $data['base_currency'];
        }

        if (! array_key_exists('converted_tax_amount', $data) && array_key_exists('tax_amount', $data)) {
            $data['converted_tax_amount'] = $data['tax_amount'];
        }

        if (! array_key_exists('converted_net_amount', $data) && array_key_exists('net_amount', $data)) {
            $data['converted_net_amount'] = $data['net_amount'];
        }

        $model->update($data);

        return $model;
    }

    public function delete(int $id, ?int $deletedBy = null)
    {
        $model = Transaction::findOrFail($id);

        return $model->softDelete($deletedBy);
    }
}
