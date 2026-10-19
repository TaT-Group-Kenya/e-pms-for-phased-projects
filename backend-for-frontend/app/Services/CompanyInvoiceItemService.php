<?php

namespace App\Services;

use App\Models\CompanyInvoice;
use App\Models\CompanyInvoiceItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CompanyInvoiceItemService
{
    public function index(
        array $filters = [],
        int $perPage = 15,
        int $page = 1,
        int $offset = 0,
        array $with = []
    ) {
        // optimized query: apply eager loading and simple filters
        $query = CompanyInvoiceItem::query();
        if (! empty($with)) {
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
        $query = CompanyInvoiceItem::query();
        if (! empty($with)) {
            $query->with($with);
        }

        return $query->findOrFail($id);
    }

    /**
     * Line items may be added or edited on any invoice that is not cancelled.
     * Deleting existing items stays limited to draft invoices so that
     * invoiced/ledger-backed documents are never silently reduced.
     */
    protected function assertInvoiceEditable(int $invoiceId, bool $requireDraft = false): CompanyInvoice
    {
        $invoice = CompanyInvoice::findOrFail($invoiceId);

        if ($invoice->status === 'cancelled') {
            throw ValidationException::withMessages([
                'invoice_id' => ['Line items cannot be changed on a cancelled company invoice.'],
            ]);
        }

        if ($requireDraft && $invoice->status !== 'draft') {
            throw ValidationException::withMessages([
                'invoice_id' => ['Line items can only be deleted while the invoice is in draft status.'],
            ]);
        }

        return $invoice;
    }

    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            $this->assertInvoiceEditable((int) $data['invoice_id']);

            return CompanyInvoiceItem::create($data);
        });
    }

    public function update(int $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $model = CompanyInvoiceItem::findOrFail($id);

            $this->assertInvoiceEditable((int) $model->invoice_id);

            $model->update($data);

            return $model;
        });
    }

    public function delete(int $id)
    {
        return DB::transaction(function () use ($id) {
            $model = CompanyInvoiceItem::findOrFail($id);

            $this->assertInvoiceEditable((int) $model->invoice_id, true);

            CompanyInvoiceItem::destroy($id);
        });
    }
}
