<?php

namespace App\Services;

use App\Models\CustCreditNote;
use App\Models\CustomerTransactionsLedger;
use App\Services\Concerns\ListQuery;
use Illuminate\Validation\ValidationException;

class CustCreditNoteService
{
    use ListQuery;

    /** Columns matched by the free-text `search` parameter. */
    protected array $listSearchable = [
        'credit_note_number',
        'title',
        'description',
    ];

    /** Columns the request may filter on with equality. */
    protected array $listFilterable = [
        'invoice_id',
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
        // optimized query: apply eager loading, search and whitelisted filters
        $query = CustCreditNote::query();
        if (! empty($with)) {
            $query->with($with);
        }

        // Logical-deletion visibility flags
        $query = $this->applyLogicalDeletion($query, $filters);

        return $this->paginateList($query, $filters, $perPage, $page);
    }

    public function find(int $id, array $with = [])
    {
        $query = CustCreditNote::query();
        if (! empty($with)) {
            $query->with($with);
        }

        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        // Header amounts are initialized to zero and always derived from items
        $data['subtotal_amount'] = 0;
        $data['tax_amount'] = 0;
        $data['total_amount'] = 0;

        // Generate unique credit_note_number
        $commonService = new CommonService;
        $creditNoteNumber = $commonService->getNextCustCreditNoteNumber();
        $data['credit_note_number'] = $creditNoteNumber;

        $model = CustCreditNote::create($data);

        // A raised credit note immediately reduces output VAT (VAT_IN).
        TaxTransactionService::syncCreditNotePosition($model);

        return $model;
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

            $hasLedgerEntries = CustomerTransactionsLedger::where('source_type', 'customer_credit_note')
                ->where('source_id', $model->id)
                ->where('is_deleted', false)
                ->exists();

            if ($hasLedgerEntries) {
                throw ValidationException::withMessages([
                    'status' => 'Credit note with recorded transactions cannot be set back to draft.',
                ]);
            }
        }

        $previousStatus = $model->status;
        $model->update($data);

        // Raised or reverting statuses move the declared VAT position.
        if (in_array($model->status, ['raised', 'draft', 'refunded'], true)
            && in_array($previousStatus, ['draft', 'raised'], true)
        ) {
            TaxTransactionService::syncCreditNotePosition($model);
        }

        return $model;
    }

    public function delete(int $id, ?int $deletedBy = null)
    {
        $model = CustCreditNote::findOrFail($id);

        $result = $model->softDelete($deletedBy);

        // A deleted raised credit note withdraws its VAT_IN position.
        TaxTransactionService::syncCreditNotePosition($model);

        return $result;
    }
}
