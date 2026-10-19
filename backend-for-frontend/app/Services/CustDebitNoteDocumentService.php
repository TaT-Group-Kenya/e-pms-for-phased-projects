<?php

namespace App\Services;

use App\Models\CustDebitNote;
use App\Models\CustDebitNoteDocument;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CustDebitNoteDocumentService
{
    public function index(array $filters = [], int $perPage = 15, int $page = 1)
    {
        $query = CustDebitNoteDocument::query()->with('debitNote');
        if (isset($filters['debit_note_id'])) {
            $query->where('debit_note_id', $filters['debit_note_id']);
        }

        return $query->orderByDesc('id')->paginate($perPage, ['*'], 'page', $page);
    }

    public function find(int $id): CustDebitNoteDocument
    {
        return CustDebitNoteDocument::with('debitNote')->findOrFail($id);
    }

    public function create(array $data): CustDebitNoteDocument
    {
        return DB::transaction(function () use ($data) {
            $this->assertDraft($data['debit_note_id']);

            return CustDebitNoteDocument::create($data);
        });
    }

    public function update(CustDebitNoteDocument $document, array $data): CustDebitNoteDocument
    {
        return DB::transaction(function () use ($document, $data) {
            $this->assertDraft($document->debit_note_id);
            $document->update($data);

            return $document->fresh('debitNote');
        });
    }

    public function delete(CustDebitNoteDocument $document, ?int $deletedBy = null): bool
    {
        return DB::transaction(function () use ($document, $deletedBy) {
            $this->assertDraft($document->debit_note_id);

            return $document->softDelete($deletedBy);
        });
    }

    private function assertDraft(int $noteId): void
    {
        if (CustDebitNote::whereKey($noteId)->lockForUpdate()->firstOrFail()->status !== 'draft') {
            throw ValidationException::withMessages(['debit_note_id' => 'Raised debit note documents cannot be modified.']);
        }
    }
}
