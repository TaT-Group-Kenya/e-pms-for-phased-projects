<?php

namespace App\Services;

use App\Models\PaymentReceivingMethod;

class PaymentReceivingMethodService
{
    public function index(
        array $filters = [],
        int $perPage = 15,
        int $page = 1,
        int $offset = 0,
        array $with = [],
        ?string $search = null
    ) {
        $query = PaymentReceivingMethod::query();
        if (!empty($with)) {
            $query->with($with);
        }

        // Only filter on valid columns
        $validColumns = [
            'type', 'name', 'currency', 'status', 'paybill', 'account_holder_name', 'account_number', 'bank', 'branch', 'swift_code', 'iban', 'is_deleted', 'created_by', 'updated_by', 'deleted_by'
        ];
        foreach ($filters as $key => $value) {
            if (in_array($key, $validColumns)) {
                $query->where($key, $value);
            }
        }

        // Dedicated search block
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('type', 'like', "%$search%")
                  ->orWhere('currency', 'like', "%$search%")
                  ->orWhere('bank', 'like', "%$search%")
                  ->orWhere('branch', 'like', "%$search%")
                  ->orWhere('account_holder_name', 'like', "%$search%")
                  ->orWhere('account_number', 'like', "%$search%")
                  ->orWhere('paybill', 'like', "%$search%")
                  ->orWhere('swift_code', 'like', "%$search%")
                  ->orWhere('iban', 'like', "%$search%")
                  ->orWhere('instruction', 'like', "%$search%")
                  ;
            });
        }

        $calculatedOffset = $page > 1 ? ($page - 1) * $perPage + $offset : $offset;
        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function find(int $id, array $with = [])
    {
        $query = PaymentReceivingMethod::query();
        if (!empty($with)) $query->with($with);
        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return PaymentReceivingMethod::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = PaymentReceivingMethod::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete(int $id, ?int $deletedBy = null)
    {
        $model = PaymentReceivingMethod::findOrFail($id);
        return $model->softDelete($deletedBy);
    }

    public function restore(int $id)
    {
        $model = PaymentReceivingMethod::withDeleted()->findOrFail($id);
        return $model->restore();
    }
}
