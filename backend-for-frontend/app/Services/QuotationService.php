<?php

namespace App\Services;

use App\Models\Quotation;

class QuotationService
{
    public function index(
        array $filters = [],
        int $perPage = 15,
        int $page = 1,
        int $offset = 0,
        array $with = ['customer', 'createdByUser', 'updatedByUser', 'projectOwner', 'receivingPaymentMethod']
    ) {
        // optimized query: apply eager loading and simple filters
        $query = Quotation::query();
        if (!empty($with)) {
            $query->with($with);
        }
        foreach ($filters as $key => $value) {
            $query->where($key, $value);
        }
        $query->orderByDesc('id');
        
        // Calculate offset if page is provided, otherwise use explicit offset
        $calculatedOffset = $page > 1 ? ($page - 1) * $perPage + $offset : $offset;
        
        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function find(int $id, array $with = [])
    {
        $with = array_merge($with, ['customer', 'createdByUser', 'updatedByUser', 'projectOwner', 'receivingPaymentMethod']);
        $query = Quotation::query();
        if (!empty($with)) $query->with($with);
        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        // If project_id is provided and currency is not, get currency from project
        if (!empty($data['project_id']) && empty($data['currency'])) {
            $project = \App\Models\Project::find($data['project_id']);
            if ($project && !empty($project->currency)) {
                $data['currency'] = $project->currency;
            }
        }
        
        return Quotation::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = Quotation::findOrFail($id);
        
        // If project_id is provided and currency is not, get currency from project
        if (!empty($data['project_id']) && empty($data['currency'])) {
            $project = \App\Models\Project::find($data['project_id']);
            if ($project && !empty($project->currency)) {
                $data['currency'] = $project->currency;
            }
        }
        
        $model->update($data);
        return $model;
    }

    public function delete(int $id, ?int $deletedBy = null)
    {
        $model = Quotation::findOrFail($id);

        return $model->softDelete($deletedBy);
    }
}