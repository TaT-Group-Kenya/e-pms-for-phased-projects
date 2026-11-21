<?php

namespace App\Services;

use App\Models\Project;
use App\Models\Quotation;
use App\Models\ShipContainer;
use App\Services\Concerns\ListQuery;

class QuotationService
{
    use ListQuery;

    /** Columns matched by the free-text `search` parameter. */
    protected array $listSearchable = [
        'quotation_number',
        'bol_number',
        'title',
    ];

    /** Columns the request may filter on with equality. */
    protected array $listFilterable = [
        'customer_id',
        'status',
        'ship_container_id',
    ];

    public function index(
        array $filters = [],
        int $perPage = 15,
        int $page = 1,
        int $offset = 0,
        array $with = ['customer', 'createdByUser', 'updatedByUser', 'projectOwner', 'receivingPaymentMethod']
    ) {
        // optimized query: apply eager loading, search and whitelisted filters
        $query = Quotation::query();
        if (! empty($with)) {
            $query->with($with);
        }

        // Logical-deletion visibility flags (Quotation previously had none, kept for parity)
        $query = $this->applyLogicalDeletion($query, $filters);

        return $this->paginateList($query, $filters, $perPage, $page);
    }

    public function find(int $id, array $with = [])
    {
        $with = array_merge($with, ['customer', 'createdByUser', 'updatedByUser', 'projectOwner', 'receivingPaymentMethod']);
        $query = Quotation::query();
        if (! empty($with)) {
            $query->with($with);
        }

        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        // If project_id is provided and currency is not, get currency from project
        if (! empty($data['project_id']) && empty($data['currency'])) {
            $project = Project::find($data['project_id']);
            if ($project && ! empty($project->currency)) {
                $data['currency'] = $project->currency;
            }
        }

        $quotation = Quotation::create($data);
        if (! empty($quotation->ship_container_id)) {
            $quotation->shipContainer()->update(['quoted' => true]);
        }

        return $quotation;
    }

    public function update(int $id, array $data)
    {
        $model = Quotation::findOrFail($id);

        // If project_id is provided and currency is not, get currency from project
        if (! empty($data['project_id']) && empty($data['currency'])) {
            $project = Project::find($data['project_id']);
            if ($project && ! empty($project->currency)) {
                $data['currency'] = $project->currency;
            }
        }

        $previousContainerId = $model->ship_container_id;

        $model->update($data);

        // A container that left the quotation is quoteable again unless
        // another active quotation still holds it.
        if ($previousContainerId && (int) $previousContainerId !== (int) ($model->ship_container_id ?? 0)) {
            ShipContainer::where('id', $previousContainerId)
                ->where('quoted', true)
                ->whereDoesntHave('quotation', function ($query) {
                    $query->where('is_deleted', false);
                })
                ->update(['quoted' => false]);
        }

        if (! empty($model->ship_container_id)) {
            $model->shipContainer()->update(['quoted' => true]);
        }

        return $model;
    }

    public function delete(int $id, ?int $deletedBy = null)
    {
        $model = Quotation::findOrFail($id);

        $result = $model->softDelete($deletedBy);

        // Deleting a quotation frees its container for new quotations unless
        // another active quotation still holds it.
        if ($model->ship_container_id && $result) {
            ShipContainer::where('id', (int) $model->ship_container_id)
                ->where('quoted', true)
                ->whereDoesntHave('quotation', function ($query) {
                    $query->where('is_deleted', false);
                })
                ->update(['quoted' => false]);
        }

        return $result;
    }
}
