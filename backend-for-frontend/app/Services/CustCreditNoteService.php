<?php

namespace App\Services;

use App\Models\CustCreditNote;
use App\Models\CustomerTransactionsLedger;
use Illuminate\Validation\ValidationException;

class CustCreditNoteService
{
    public function index(
        array $filters = [],
        int $perPage = 15,
        int $page = 1,
        int $offset = 0,
        array $with = []
    ) {
        // optimized query: apply eager loading and simple filters
        $query = CustCreditNote::query();
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
        
        // Calculate offset if page is provided, otherwise use explicit offset
        $calculatedOffset = $page > 1 ? ($page - 1) * $perPage + $offset : $offset;
        
        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function find(int $id, array $with = [])
    {
        $query = CustCreditNote::query();
        if (!empty($with)) $query->with($with);
        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        // Header amounts are always derived from items
        unset($data['subtotal_amount'], $data['tax_amount'], $data['total_amount']);

        // Generate unique credit_note_number
        $commonService = new \App\Services\CommonService();
        do {
            $creditNoteNumber = $commonService->generateUniqueCode('CCN-');
        } while (CustCreditNote::where('credit_note_number', $creditNoteNumber)->exists());
        $data['credit_note_number'] = $creditNoteNumber;

        return CustCreditNote::create($data);
    }

    public function update(int $id, array $data)
    {
        // Header amounts are always derived from items
        unset($data['subtotal_amount'], $data['tax_amount'], $data['total_amount']);

        $model = CustCreditNote::findOrFail($id);

        // Once refunded, the credit note is fully locked.
        if ($model->status === 'refunded') {
            throw ValidationException::withMessages([
                'status' => 'Credit note cannot be modified when it is in refunded status.',
            ]);
        }

        // For a raised credit note, only allow reverting back to draft when there are
        // no customer ledger entries linked to this credit note.
        if ($model->status === 'raised') {
            $targetStatus = $data['status'] ?? null;

            if ($targetStatus !== 'draft') {
                throw ValidationException::withMessages([
                    'status' => 'Raised credit notes can only be changed back to draft.',
                ]);
            }

            $hasLedgerEntries = CustomerTransactionsLedger::where('source_type', 'customer credit note')
                ->where('source_id', $model->id)
                ->where('is_deleted', false)
                ->exists();

            if ($hasLedgerEntries) {
                throw ValidationException::withMessages([
                    'status' => 'Credit note with recorded transactions cannot be set back to draft.',
                ]);
            }
        }

        $model->update($data);
        return $model;
    }

    public function delete(int $id, ?int $deletedBy = null)
    {
        $model = CustCreditNote::findOrFail($id);

        return $model->softDelete($deletedBy);
    }
}