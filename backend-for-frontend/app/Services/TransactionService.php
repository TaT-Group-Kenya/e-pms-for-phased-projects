<?php

namespace App\Services;

use App\Models\Transaction;

class TransactionService
{
    public function index(
        array $filters = [],
        int $perPage = 15,
        int $page = 1,
        int $offset = 0,
        array $with = []
    ) {
        // optimized query: apply eager loading and simple filters
        $query = Transaction::query();
        if (!empty($with)) {
            $query->with($with);
        }
        foreach ($filters as $key => $value) {
            $query->where($key, $value);
        }
        
        // Calculate offset if page is provided, otherwise use explicit offset
        $calculatedOffset = $page > 1 ? ($page - 1) * $perPage + $offset : $offset;
        
        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function find(int $id, array $with = [])
    {
        $query = Transaction::query();
        if (!empty($with)) $query->with($with);
        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        // Default FX-related fields when not explicitly provided.
        if (!array_key_exists('transaction_currency', $data) || $data['transaction_currency'] === null) {
            $data['transaction_currency'] = $data['base_currency'] ?? null;
        }

        if (!array_key_exists('converted_tax_amount', $data) || $data['converted_tax_amount'] === null) {
            if (array_key_exists('tax_amount', $data)) {
                $data['converted_tax_amount'] = $data['tax_amount'];
            }
        }

        if (!array_key_exists('converted_net_amount', $data) || $data['converted_net_amount'] === null) {
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
        if (!array_key_exists('transaction_currency', $data) && array_key_exists('base_currency', $data)) {
            $data['transaction_currency'] = $data['base_currency'];
        }

        if (!array_key_exists('converted_tax_amount', $data) && array_key_exists('tax_amount', $data)) {
            $data['converted_tax_amount'] = $data['tax_amount'];
        }

        if (!array_key_exists('converted_net_amount', $data) && array_key_exists('net_amount', $data)) {
            $data['converted_net_amount'] = $data['net_amount'];
        }

        $model->update($data);
        return $model;
    }

    public function delete(int $id)
    {
        return Transaction::destroy($id);
    }
}