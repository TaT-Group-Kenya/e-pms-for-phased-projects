<?php

namespace App\Services;

use App\Models\CustDebitNote;
use App\Models\CustInvoice;
use App\Models\CustomerTransactionsLedger;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CustDebitNoteService
{
    // A debit note documents an additional charge against an invoice that has
    // already been issued to the customer (or settled), never a draft one.
    private const ELIGIBLE_INVOICE_STATUSES = ['sent', 'partial-paid', 'paid'];

    public function index(array $filters = [], int $perPage = 15, int $page = 1, array $with = [])
    {
        $query = CustDebitNote::query()->with($with);
        foreach ($filters as $key => $value) {
            if (in_array($key, ['invoice_id', 'status'], true)) {
                $query->where($key, $value);
            }
        }

        return $query->orderByDesc('id')->paginate($perPage, ['*'], 'page', $page);
    }

    public function find(int $id, array $with = []): CustDebitNote
    {
        return CustDebitNote::with($with)->findOrFail($id);
    }

    public function create(array $data): CustDebitNote
    {
        return DB::transaction(function () use ($data) {
            $invoice = CustInvoice::findOrFail($data['invoice_id']);
            if (! in_array(strtolower((string) $invoice->status), self::ELIGIBLE_INVOICE_STATUSES, true)) {
                throw ValidationException::withMessages([
                    'invoice_id' => 'Debit notes can only be created for invoices that were issued to the customer.',
                ]);
            }
            if (isset($data['currency']) && strtoupper($data['currency']) !== strtoupper($invoice->currency)) {
                throw ValidationException::withMessages(['currency' => 'Debit note currency must match the linked invoice.']);
            }
            $data['currency'] = $invoice->currency;
            $data['status'] = 'draft';
            $data['subtotal_amount'] = 0;
            $data['tax_amount'] = 0;
            $data['total_amount'] = 0;
            $data['notes_to_customer'] = $data['notes_to_customer'] ?? 'Additional charges for invoice '.$invoice->invoice_number;
            unset($data['debit_note_number']);

            $commonService = new CommonService;
            do {
                $data['debit_note_number'] = $commonService->getNextCustDebitNoteNumber();
            } while (CustDebitNote::withDeleted()->where('debit_note_number', $data['debit_note_number'])->exists());

            return CustDebitNote::create($data);
        });
    }

    public function update(int $id, array $data, ?int $updatedBy = null): CustDebitNote
    {
        return DB::transaction(function () use ($id, $data, $updatedBy) {
            $note = CustDebitNote::whereKey($id)->lockForUpdate()->firstOrFail();
            if ($note->status === 'raised') {
                throw ValidationException::withMessages(['status' => 'Raised debit notes cannot be modified or reverted.']);
            }

            if (array_key_exists('invoice_id', $data)) {
                $invoice = CustInvoice::findOrFail($data['invoice_id']);
                if (! in_array(strtolower((string) $invoice->status), self::ELIGIBLE_INVOICE_STATUSES, true)) {
                    throw ValidationException::withMessages([
                        'invoice_id' => 'Debit notes can only be linked to invoices that were issued to the customer.',
                    ]);
                }
            } else {
                $invoice = $note->invoice;
            }
            if (isset($data['currency']) && strtoupper($data['currency']) !== strtoupper($invoice->currency)) {
                throw ValidationException::withMessages(['currency' => 'Debit note currency must match the linked invoice.']);
            }
            $data['currency'] = $invoice->currency;
            unset($data['subtotal_amount'], $data['tax_amount'], $data['total_amount'], $data['debit_note_number']);

            $targetStatus = $data['status'] ?? 'draft';
            if (! in_array($targetStatus, ['draft', 'raised'], true)) {
                throw ValidationException::withMessages(['status' => 'Debit note status must be draft or raised.']);
            }
            $note->fill($data);
            $note->updated_by = $updatedBy;
            $note->save();

            if ($targetStatus === 'raised') {
                $this->postToLedger($note, $updatedBy);
            }

            return $note->fresh(['invoice.customer', 'invoice.project', 'items', 'documents']);
        });
    }

    public function delete(int $id, ?int $deletedBy = null): bool
    {
        return DB::transaction(function () use ($id, $deletedBy) {
            $note = CustDebitNote::whereKey($id)->lockForUpdate()->firstOrFail();
            if ($note->status === 'raised') {
                throw ValidationException::withMessages(['status' => 'Raised debit notes cannot be deleted.']);
            }

            return $note->softDelete($deletedBy);
        });
    }

    protected function postToLedger(CustDebitNote $note, ?int $userId): void
    {
        $note = CustDebitNote::whereKey($note->id)->lockForUpdate()->firstOrFail();
        if (CustomerTransactionsLedger::where('source_type', 'customer_debit_note')
            ->where('source_id', $note->id)
            ->where('is_deleted', false)
            ->exists()) {
            throw ValidationException::withMessages(['status' => 'This debit note has already been posted to the customer ledger.']);
        }

        $invoice = $note->invoice;
        $amount = (float) $note->total_amount;
        $tax = (float) $note->tax_amount;
        $net = (float) $note->subtotal_amount;
        $baseCurrency = 'KES';
        $conversion = (new CurrencyConversionService)->convertToBaseFromInvoice($amount, $note->currency, $baseCurrency);
        $exchangeRate = $conversion['exchange_rate'];
        $convertedAmount = $conversion['converted_amount'];
        $postedAt = now();
        CustomerTransactionsLedger::create([
            'transaction_number' => $note->debit_note_number,
            'transaction_type' => 'invoice',
            'transaction_date' => $postedAt->toDateString(),
            'posted_date' => $postedAt->toDateString(),
            'amount' => $amount,
            'transaction_currency' => $note->currency,
            'base_currency' => $baseCurrency,
            'exchange_rate' => $exchangeRate,
            'converted_amount' => $convertedAmount,
            'converted_tax_amount' => $tax * $exchangeRate,
            'converted_net_amount' => $net * $exchangeRate,
            'tax_amount' => $tax,
            'net_amount' => $net,
            'customer_id' => $invoice->customer_id,
            'source_type' => 'customer_debit_note',
            'source_id' => $note->id,
            'account_debit' => null,
            'account_credit' => null,
            'category' => 'revenue',
            'transaction_status' => 'cleared',
            'narration' => 'Debit note '.$note->debit_note_number.' for invoice '.$invoice->invoice_number,
            'is_recurring' => false,
            'fiscal_year' => (string) $postedAt->year,
            'accounting_period' => $postedAt->format('Ym'),
            'is_adjusting_entry' => false,
            'cost_center_id' => null,
            'created_by' => $userId,
            'updated_by' => $userId,
        ]);
    }
}
