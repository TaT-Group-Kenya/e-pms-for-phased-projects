<?php

namespace App\Services;

use App\Models\Lender;

class LenderService
{
    public function index(
        array $filters = [],
        int $perPage = 15,
        int $page = 1,
        int $offset = 0,
        array $with = [],
        ?string $search = null
    ) {
        $query = Lender::query();
        if (! empty($with)) {
            $query->with($with);
        }

        $validColumns = ['name', 'email', 'phone', 'kra_pin', 'is_deleted'];
        foreach ($filters as $key => $value) {
            if (in_array($key, $validColumns)) {
                $query->where($key, $value);
            }
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%")
                    ->orWhere('phone', 'like', "%$search%")
                    ->orWhere('kra_pin', 'like', "%$search%")
                    ->orWhere('address', 'like', "%$search%");
            });
        }

        $query->orderByDesc('id');

        $calculatedOffset = $page > 1 ? ($page - 1) * $perPage + $offset : $offset;

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function find(int $id, array $with = [])
    {
        $query = Lender::query();
        if (! empty($with)) {
            $query->with($with);
        }

        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return Lender::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = Lender::findOrFail($id);
        $model->update($data);

        return $model;
    }

    public function delete(int $id, ?int $deletedBy = null)
    {
        $model = Lender::findOrFail($id);

        return $model->softDelete($deletedBy);
    }
}
