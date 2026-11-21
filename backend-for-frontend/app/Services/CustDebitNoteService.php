<?php

namespace App\Services;

use App\Models\Account;
use App\Models\CustDebitNote;
use App\Models\CustDebitNotePayment;
use App\Models\CustInvoice;
use App\Models\CustomerTransactionsLedger;
use App\Models\CustPayment;
use App\Models\PdcReceivedCustomer;
use App\Services\Concerns\ListQuery;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CustDebitNoteService
{
    use ListQuery;

    /** Columns matched by the free-text `search` parameter. */
    protected array $listSearchable = [
        'debit_note_number',
        'title',
    ];

    /** Columns the request may filter on with equality. */
    protected array $listFilterable = [
        'invoice_id',
        'status',
        'currency',
    ];

    // A debit note documents an additional charge against an invoice that has
    // already been issued to the customer (or settled), never a draft one.
    private const ELIGIBLE_INVOICE_STATUSES = ['sent', 'partial-paid', 'paid'];

    public function index(array $filters = [], int $perPage = 15, int $page = 1, array $with = [])
    {
        $query = CustDebitNote::query()->with($with);

        return $this->paginateList($query, $filters, $perPage, $page);
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
            if (in_array($note->status, ['paid'], true)) {
                throw ValidationException::withMessages(['status' => 'Fully paid debit notes cannot be modified.']);
            }
            if ($note->status === 'raised' && ($data['status'] ?? null) !== 'raised') {
                // Raised notes may only stay raised here; payment settlement is separate.
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

                // Raised notes declare their output VAT.
                TaxTransactionService::syncDebitNotePosition($note);
            } elseif ($targetStatus === 'draft') {
                // Falling back to draft withdraws the declared VAT.
                TaxTransactionService::syncDebitNotePosition($note);
            }

            return $note->fresh(['invoice.customer', 'invoice.project', 'items', 'documents']);
        });
    }

    public function delete(int $id, ?int $deletedBy = null): bool
    {
        return DB::transaction(function () use ($id, $deletedBy) {
            $note = CustDebitNote::withDeleted()->whereKey($id)->lockForUpdate()->firstOrFail();
            if ($note->status === 'raised') {
                throw ValidationException::withMessages(['status' => 'Raised debit notes cannot be deleted.']);
            }

            $result = $note->softDelete($deletedBy);

            // Any tax position (e.g. previously raised) must be withdrawn.
            TaxTransactionService::syncDebitNotePosition($note);

            return $result;
        });
    }

    /**
     * Receive a payment against a raised debit note.
     * The payment is a credit against the customer (settles the note's debit),
     * posted to the customer transactions ledger as a 'receipt'.
     */
    public function addPayment(CustDebitNote $note, array $data, ?int $userId = null): CustDebitNote
    {
        return DB::transaction(function () use ($note, $data, $userId) {
            $note = CustDebitNote::whereKey($note->id)->lockForUpdate()->firstOrFail();

            if (! in_array($note->status, ['raised', 'partial-paid'], true)) {
                throw ValidationException::withMessages([
                    'status' => 'Payments can only be received against raised debit notes.',
                ]);
            }

            $account = Account::findOrFail($data['account_id']);

            if ($account->currency !== $note->currency) {
                throw ValidationException::withMessages([
                    'account_id' => 'Benefiting account currency must match the debit note currency.',
                ]);
            }

            $amountPaid = (float) $data['amount_paid'];
            $totalPaid = (float) $note->debitNotePayments()->where('is_deleted', false)->sum('allocated_amount');
            $previousBalance = max((float) $note->total_amount - $totalPaid, 0.0);
            $tolerance = 0.01;

            if ($amountPaid > $previousBalance + $tolerance) {
                $excess = $amountPaid - $previousBalance;
                throw ValidationException::withMessages([
                    'amount_paid' => ['Payment amount exceeds the outstanding debit note balance by '.number_format($excess, 2, '.', '').'.'],
                ]);
            }

            $afterBalance = max($previousBalance - $amountPaid, 0.0);
            $installmentNumber = $note->debitNotePayments()->where('is_deleted', false)->count() + 1;

            // Derive tax vs net portions from the note totals, like invoice payments
            $noteTotal = (float) $note->total_amount;
            $noteTaxTotal = (float) $note->tax_amount;
            if ($noteTotal > 0 && $noteTaxTotal > 0) {
                $taxPortion = min(
                    round(($noteTaxTotal / $noteTotal) * $amountPaid, 2),
                    $amountPaid
                );
            } else {
                $taxPortion = 0.0;
            }
            $netPortion = $amountPaid - $taxPortion;

            $baseCurrencyForLocalTaxationCode = 'KES';
            $noteCurrencyCode = $note->currency;

            $conversion = (new CurrencyConversionService)->convertToBaseFromInvoice(
                $amountPaid,
                $noteCurrencyCode,
                $baseCurrencyForLocalTaxationCode
            );
            $exchangeRate = $conversion['exchange_rate'];
            $convertedAmount = $conversion['converted_amount'];

            $commonService = new CommonService;

            $validatedDate = $data['payment_date'];
            $paymentMethod = strtolower((string) $data['payment_method']);

            // Future-dated cheques are parked as PDCs, mirroring the invoice flow
            if ($paymentMethod === 'check') {
                $chequeDate = ! empty($data['cheque_date'])
                    ? Carbon::parse($data['cheque_date'])->toDateString()
                    : $validatedDate;

                $receiptNumber = $data['receipt_number'] ?? null;
                if (empty($receiptNumber) && ! empty($data['check_number'])) {
                    $receiptNumber = 'chk-'.$data['check_number'];
                }

                if ($chequeDate > now()->toDateString()) {
                    do {
                        $pdcTxn = $commonService->generateUniqueCode('PDC-');
                    } while (PdcReceivedCustomer::where('transaction_number', $pdcTxn)->exists());

                    PdcReceivedCustomer::create([
                        'transaction_number' => $pdcTxn,
                        'customer_id' => $note->invoice?->customer_id,
                        'invoice_id' => $note->invoice_id,
                        'debit_note_id' => $note->id,
                        'forex_rate' => 1,
                        'cheque_number' => $data['check_number'] ?? null,
                        'cheque_date' => $chequeDate,
                        'received_date' => $validatedDate,
                        'amount' => $amountPaid,
                        'currency' => $noteCurrencyCode,
                        'bank' => $data['bank_name'] ?? null,
                        'bank_branch' => $data['bank_branch'] ?? null,
                        'bank_account_id' => $account->id,
                        'status' => 'received',
                        'narration' => 'PDC created from debit note receipt (deferred).',
                        'created_at' => now(),
                        'created_by' => $userId,
                    ]);

                    return $note->fresh(['invoice.customer', 'invoice.project', 'items', 'documents']);
                }
            }

            $transactionNumber = $data['transaction_number'] ?? null;
            if (empty($transactionNumber)) {
                do {
                    $transactionNumber = $commonService->generateUniqueCode('CUSTPM-');
                } while (CustPayment::where('transaction_number', $transactionNumber)->exists());
            }

            $receiptNumber = $data['receipt_number'] ?? $transactionNumber;

            $payment = CustPayment::create([
                'transaction_number' => $transactionNumber,
                'amount_paid' => $amountPaid,
                'direction' => 'incoming',
                'transaction_type' => 'receipt',
                'tax_amount' => $taxPortion,
                'net_amount' => $netPortion,
                'payment_date' => $validatedDate,
                'payment_method' => $data['payment_method'],
                'payment_status' => $data['payment_status'] ?? 'complete',
                'currency' => $noteCurrencyCode,
                'bank_name' => $data['bank_name'] ?? null,
                'check_number' => $data['check_number'] ?? null,
                'transaction_reference' => $receiptNumber,
                'receipt_number' => $receiptNumber,
                'invoice_total_amount' => $noteTotal,
                'exchange_rate' => $exchangeRate,
                'fee_or_charge' => 0.0,
                'payment_type' => 'normal',
                'reconciled' => false,
                'reconciliation_date' => null,
                'created_by' => $userId,
                'updated_by' => $userId,
            ]);

            // Link the payment to this debit note (allocation-style record)
            CustDebitNotePayment::create([
                'debit_note_id' => $note->id,
                'payment_id' => $payment->id,
                'allocated_amount' => $amountPaid,
                'payment_date' => $validatedDate,
                'installment_number' => $installmentNumber,
                'created_by' => $userId,
                'updated_by' => $userId,
            ]);

            // Credit entry in the customer ledger: the received payment settles the note's debit
            $ledger = CustomerTransactionsLedger::create([
                'cust_payment_id' => $payment->id,
                'transaction_number' => $payment->transaction_number,
                'transaction_type' => 'receipt',
                'transaction_date' => $validatedDate,
                'posted_date' => now(),
                'amount' => $amountPaid,
                'transaction_currency' => $noteCurrencyCode,
                'base_currency' => $baseCurrencyForLocalTaxationCode,
                'exchange_rate' => $exchangeRate,
                'converted_amount' => $convertedAmount,
                'converted_tax_amount' => $taxPortion * $exchangeRate,
                'converted_net_amount' => $netPortion * $exchangeRate,
                'tax_amount' => $taxPortion,
                'net_amount' => $netPortion,
                'customer_id' => $note->invoice?->customer_id,
                'source_type' => 'customer_debit_note',
                'source_id' => $note->id,
                'account_debit' => null,
                'account_credit' => $account->id,
                'category' => 'revenue',
                'payment_method' => $data['payment_method'],
                'bank_account' => $data['bank_name'] ?? null,
                'check_number' => $data['check_number'] ?? null,
                'transaction_status' => 'cleared',
                'related_transaction_id' => $data['related_transaction_id'] ?? null,
                'narration' => 'Payment for debit note '.$note->debit_note_number,
                'is_recurring' => false,
                'fiscal_year' => now()->year,
                'accounting_period' => now()->format('Ym'),
                'is_adjusting_entry' => false,
                'cost_center_id' => null,
                'created_by' => $userId,
                'updated_by' => $userId,
            ]);

            $payment->transaction_id = $ledger->id;
            $payment->save();

            // Update benefiting account balance: credit increases balance
            $currentBalance = (float) $account->balance;
            $account->balance = (string) number_format($currentBalance + $amountPaid, 2, '.', '');
            $account->updated_at = now();
            $account->updated_by = $userId;
            $account->save();

            // Update the debit note status, mirroring invoice settlement
            if ($afterBalance <= 0) {
                $note->status = 'paid';
            } else {
                $note->status = 'partial-paid';
            }
            $note->updated_by = $userId;
            $note->save();

            return $note->fresh(['invoice.customer', 'invoice.project', 'items', 'documents', 'payments', 'debitNotePayments']);
        });
    }

    /**
     * Update non-financial metadata of a payment received against a debit note.
     * Financial fields (amount, date, account, currency) require delete + re-add.
     */
    public function updatePayment(CustDebitNote $note, CustPayment $payment, array $data, ?int $userId = null): CustDebitNote
    {
        return DB::transaction(function () use ($note, $payment, $data, $userId) {
            $link = CustDebitNotePayment::where('payment_id', $payment->id)
                ->where('debit_note_id', $note->id)
                ->where('is_deleted', false)
                ->first();

            if (! $link) {
                throw ValidationException::withMessages([
                    'payment_id' => ['Payment is not associated with this debit note.'],
                ]);
            }

            if ($payment->reconciled) {
                throw ValidationException::withMessages([
                    'payment_id' => ['Reconciled payments cannot be edited.'],
                ]);
            }

            if (array_key_exists('payment_status', $data)) {
                $payment->payment_status = $data['payment_status'];
            }
            if (array_key_exists('bank_name', $data)) {
                $payment->bank_name = $data['bank_name'];
            }
            if (array_key_exists('check_number', $data)) {
                $payment->check_number = $data['check_number'];
            }
            if (array_key_exists('receipt_number', $data)) {
                $payment->receipt_number = $data['receipt_number'];
                $payment->transaction_reference = $data['receipt_number'];
            }

            $payment->updated_by = $userId;
            $payment->updated_at = now();
            $payment->save();

            $ledgers = CustomerTransactionsLedger::where('cust_payment_id', $payment->id)
                ->where('source_type', 'customer_debit_note')
                ->where('source_id', $note->id)
                ->where('is_deleted', false)
                ->get();

            foreach ($ledgers as $ledger) {
                if (array_key_exists('bank_name', $data)) {
                    $ledger->bank_account = $data['bank_name'];
                }
                if (array_key_exists('check_number', $data)) {
                    $ledger->check_number = $data['check_number'];
                }
                if (array_key_exists('receipt_number', $data)) {
                    $ledger->transaction_reference = $data['receipt_number'];
                }
                $ledger->updated_by = $userId;
                $ledger->updated_at = now();
                $ledger->save();
            }

            return $note->fresh(['invoice.customer', 'invoice.project', 'items', 'documents', 'payments', 'debitNotePayments']);
        });
    }

    /**
     * Delete (reverse) a payment received against a debit note: soft-deletes the
     * payment and link, soft-deletes the ledger receipt and restores account and
     * note status exactly like invoice payment deletion.
     */
    public function deletePayment(CustDebitNote $note, CustPayment $payment, ?int $userId = null): CustDebitNote
    {
        return DB::transaction(function () use ($note, $payment, $userId) {
            $note = CustDebitNote::whereKey($note->id)->lockForUpdate()->firstOrFail();

            $links = CustDebitNotePayment::where('payment_id', $payment->id)
                ->where('debit_note_id', $note->id)
                ->where('is_deleted', false)
                ->get();

            if ($links->isEmpty()) {
                throw ValidationException::withMessages([
                    'payment_id' => ['Payment is not associated with this debit note.'],
                ]);
            }

            if ($payment->reconciled) {
                throw ValidationException::withMessages([
                    'payment_id' => ['Reconciled payments cannot be deleted.'],
                ]);
            }

            $payment->softDelete($userId);

            foreach ($links as $link) {
                if (! $link->is_deleted) {
                    $link->is_deleted = true;
                    $link->deleted_at = now();
                    $link->deleted_by = $userId;
                    $link->save();
                }
            }

            $ledgers = CustomerTransactionsLedger::where('cust_payment_id', $payment->id)
                ->where('source_type', 'customer_debit_note')
                ->where('source_id', $note->id)
                ->where('is_deleted', false)
                ->get();

            // Reverse the credit on the benefiting account balance(s)
            $amountsByAccount = [];
            foreach ($ledgers as $ledger) {
                if (! empty($ledger->account_credit)) {
                    $accountId = $ledger->account_credit;
                    $amountsByAccount[$accountId] = ($amountsByAccount[$accountId] ?? 0.0)
                        + (float) $ledger->amount;
                }
            }

            foreach ($amountsByAccount as $accountId => $amountToReverse) {
                $account = Account::withDeleted()->find($accountId);
                if ($account) {
                    $account->balance = (string) number_format((float) $account->balance - $amountToReverse, 2, '.', '');
                    $account->updated_at = now();
                    $account->updated_by = $userId;
                    $account->save();
                }
            }

            foreach ($ledgers as $ledger) {
                $ledger->softDelete($userId);
            }

            // Recompute note status from remaining (non-deleted) settlements
            $remainingPaid = (float) $note->debitNotePayments()->where('is_deleted', false)->sum('allocated_amount');

            if ($remainingPaid <= 0) {
                $note->status = 'raised';
            } elseif ((float) $note->total_amount - $remainingPaid <= 0.01) {
                $note->status = 'paid';
            } else {
                $note->status = 'partial-paid';
            }

            $note->updated_by = $userId;
            $note->save();

            return $note->fresh(['invoice.customer', 'invoice.project', 'items', 'documents', 'payments', 'debitNotePayments']);
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
