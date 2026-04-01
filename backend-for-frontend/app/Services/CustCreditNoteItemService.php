<?php

namespace App\Services;

use App\Models\CustCreditNoteItem;
use App\Models\CustCreditNote;
use Illuminate\Validation\ValidationException;

class CustCreditNoteItemService
{
    public function index(
        array $filters = [],
        int $perPage = 15,
        int $page = 1,
        int $offset = 0,
        array $with = []
    ) {
        // optimized query: apply eager loading and simple filters
        $query = CustCreditNoteItem::query();
        if (!empty($with)) {
            $query->with($with);
        }
        // Handle soft-delete visibility flags
        $withDeleted = filter_var($filters['with_deleted'] ?? null, FILTER_VALIDATE_BOOLEAN);
        $onlyDeleted = filter_var($filters['only_deleted'] ?? null, FILTER_VALIDATE_BOOLEAN);

        unset($filters['with_deleted'], $filters['only_deleted']);

        if ($onlyDeleted) {
            $query->onlyDeleted();
        } elseif ($withDeleted) {
            $query->withDeleted();
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
        $query = CustCreditNoteItem::query();
        if (!empty($with)) $query->with($with);
        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        $creditNoteId = $data['credit_note_id'] ?? null;

        if (! $creditNoteId) {
            throw ValidationException::withMessages([
                'credit_note_id' => 'Credit note id is required.',
            ]);
        }

        $note = CustCreditNote::findOrFail($creditNoteId);

        if (in_array($note->status, ['raised', 'refunded'], true)) {
            throw ValidationException::withMessages([
                'credit_note_id' => 'Credit note items cannot be modified when the credit note status is raised or refunded.',
            ]);
        }

        return CustCreditNoteItem::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = CustCreditNoteItem::findOrFail($id);

        $note = $model->creditNote;
        if ($note && in_array($note->status, ['raised', 'refunded'], true)) {
            throw ValidationException::withMessages([
                'credit_note_id' => 'Credit note items cannot be modified when the credit note status is raised or refunded.',
            ]);
        }

        $model->update($data);
        return $model;
    }

    public function delete(int $id, ?int $deletedBy = null)
    {
        $model = CustCreditNoteItem::findOrFail($id);

        $note = $model->creditNote;
        if ($note && in_array($note->status, ['raised', 'refunded'], true)) {
            throw ValidationException::withMessages([
                'credit_note_id' => 'Credit note items cannot be modified when the credit note status is raised or refunded.',
            ]);
        }

        return $model->softDelete($deletedBy);
    }
}