<?php

namespace App\Services;

use App\Models\CustDebitNote;
use App\Models\CustDebitNoteItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CustDebitNoteItemService
{
    public function index(array $filters = [], int $perPage = 15, int $page = 1)
    {
        $query = CustDebitNoteItem::query()->with('debitNote');
        if (isset($filters['debit_note_id'])) {
            $query->where('debit_note_id', $filters['debit_note_id']);
        }

        return $query->orderByDesc('id')->paginate($perPage, ['*'], 'page', $page);
    }

    public function find(int $id): CustDebitNoteItem
    {
        return CustDebitNoteItem::with('debitNote')->findOrFail($id);
    }

    public function create(array $data): CustDebitNoteItem
    {
        return DB::transaction(function () use ($data) {
            $this->assertDraft($data['debit_note_id']);

            return CustDebitNoteItem::create($data);
        });
    }

    public function update(int $id, array $data): CustDebitNoteItem
    {
        return DB::transaction(function () use ($id, $data) {
            $item = CustDebitNoteItem::findOrFail($id);
            $this->assertDraft($item->debit_note_id);
            $item->update($data);

            return $item->fresh('debitNote');
        });
    }

    public function delete(int $id, ?int $deletedBy = null): bool
    {
        return DB::transaction(function () use ($id, $deletedBy) {
            $item = CustDebitNoteItem::findOrFail($id);
            $this->assertDraft($item->debit_note_id);

            return $item->softDelete($deletedBy);
        });
    }

    private function assertDraft(int $noteId): void
    {
        if (CustDebitNote::whereKey($noteId)->lockForUpdate()->firstOrFail()->status !== 'draft') {
            throw ValidationException::withMessages(['debit_note_id' => 'Raised debit note items cannot be modified.']);
        }
    }
}
