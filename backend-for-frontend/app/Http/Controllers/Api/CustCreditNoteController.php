<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\CustCreditNote;
use App\Models\CustInvoice;
use App\Services\CustCreditNoteService;
use App\Models\CustPayment;
use App\Models\CustomerTransactionsLedger;
use App\Models\Account;
use App\Services\CommonService;
use App\Services\CurrencyConversionService;
use App\Http\Resources\CustCreditNoteResource;
use App\Http\Requests\CustCreditNoteStoreRequest;
use App\Http\Requests\CustCreditNoteUpdateRequest;

use Illuminate\Support\Facades\Storage;
use App\Models\Download;
use Illuminate\Support\Facades\Mail;
use App\Http\Resources\CustInvoiceResource;

class CustCreditNoteController extends Controller
{
    protected $service;

    public function __construct(CustCreditNoteService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\CustCreditNote::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return CustCreditNoteResource::collection($data);
    }

    public function store(CustCreditNoteStoreRequest $request)
    {
        $this->authorize('create', \App\Models\CustCreditNote::class);
        $validated = $request->validated();
        if (!empty($validated['invoice_id'])) {
            $invoice = CustInvoice::find($validated['invoice_id']);

            if (!$invoice) {
                return response()->json([
                    'message' => 'The selected invoice is invalid.',
                ], 422);
            }

            if (strtolower($invoice->status) !== 'paid') {
                return response()->json([
                    'message' => 'Credit notes can only be created for fully paid invoices.',
                ], 422);
            }
        }
        $validated['created_by'] = Auth::id();
        // Generate credit_note_number if not provided
        if (empty($validated['credit_note_number'])) {
            $commonService = new CommonService();
            do {
                $creditNoteNumber = $commonService->generateUniqueCode('CCN-');
            } while (CustCreditNote::where('credit_note_number', $creditNoteNumber)->exists());
            $validated['credit_note_number'] = $creditNoteNumber;
        }
        $model = $this->service->create($validated);
        return new CustCreditNoteResource($model);
    }

    public function show(CustCreditNote $custCreditNote)
    {
        $this->authorize('view', $custCreditNote);

        $custCreditNote->loadMissing([
            'invoice',
            'items',
        ]);

        return new CustCreditNoteResource($custCreditNote);
    }

    public function update(CustCreditNoteUpdateRequest $request, CustCreditNote $custCreditNote)
    {
        $this->authorize('update', $custCreditNote);

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($custCreditNote->id, $validated);
        $updated->loadMissing([
            'invoice',
            'items',
        ]);
        return new CustCreditNoteResource($updated);
    }

    public function refund(Request $request, CustCreditNote $custCreditNote)
    {
        $this->authorize('update', $custCreditNote);

        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:0.01'],
            'date' => ['required', 'date'],
            'financing_account' => ['required', 'integer', 'exists:accounts,id'],
            'narration' => ['nullable', 'string'],
        ]);

        $validated['payment_method'] = 'bank_transfer';
        
        if (strtolower($custCreditNote->status) !== 'raised') {
            return response()->json([
                'message' => 'Only raised credit notes can be refunded.',
            ], 422);
        }

        // Extra guard: do not allow another refund if a refund ledger already exists
        $existingRefund = CustomerTransactionsLedger::where('source_type', 'customer credit note')
            ->where('source_id', $custCreditNote->id)
            ->where('transaction_type', 'refund')
            ->where('is_deleted', false)
            ->exists();

        if ($existingRefund) {
            return response()->json([
                'message' => 'This credit note already has a recorded refund.',
            ], 422);
        }

        $amount = (float) $validated['amount'];
        $creditNoteTotal = (float) $custCreditNote->total_amount;

        // Enforce single-installment, full-amount refund only.
        if (abs($amount - $creditNoteTotal) > 0.009) {
            return response()->json([
                'message' => 'Refund amount must equal the full credit note total.',
            ], 422);
        }

        $userId = $request->user()?->id;


        $account = Account::findOrFail($validated['financing_account']);

        if ($account->currency !== $custCreditNote->currency) {
            return response()->json([
                'message' => 'Financing account currency must match the credit note currency.',
            ], 422);
        }

        // Check if the account has enough balance to fund the refund
        $currentBalance = (float) $account->balance;
        if ($currentBalance < $amount) {
            return response()->json([
                'message' => 'The selected financing account does not have enough balance to fund this refund transaction.',
            ], 422);
        }

        $invoiceCurrencyCode = $custCreditNote->currency;
        $baseCurrencyForLocalTaxationCode = 'KES';

        $conversionService = new CurrencyConversionService();
        $conversion = $conversionService->convertToBaseFromInvoice(
            $amount,
            $invoiceCurrencyCode,
            $baseCurrencyForLocalTaxationCode
        );

        $exchangeRate = $conversion['exchange_rate'];
        $convertedAmount = $conversion['converted_amount'];
        $baseCurrency = $conversion['base_currency'];

        $custCreditNote = DB::transaction(function () use (
            $custCreditNote,
            $validated,
            $amount,
            $invoiceCurrencyCode,
            $baseCurrency,
            $exchangeRate,
            $convertedAmount,
            $account,
            $userId
        ) {
            $commonService = new CommonService();

            // Generate a unique transaction number for the refund payment
            do {
                $transactionNumber = $commonService->generateUniqueCode('CUSTREF-');
            } while (CustPayment::where('transaction_number', $transactionNumber)->exists());

            // Compute tax and net portions from the credit note fields
            $taxPortion = (float) $custCreditNote->tax_amount;
            $netPortion = (float) $custCreditNote->subtotal_amount;
            // Fallback: if subtotal is not set, compute as total - tax
            if ($netPortion === 0.0 && $taxPortion > 0.0) {
                $netPortion = (float) $custCreditNote->total_amount - $taxPortion;
            }
            // Ensure the sum matches the total
            if (abs(($netPortion + $taxPortion) - (float) $custCreditNote->total_amount) > 0.01) {
                // As a last resort, treat all as net
                $netPortion = (float) $custCreditNote->total_amount;
                $taxPortion = 0.0;
            }

            // Create an outgoing customer payment representing the refund.
            $validated['receipt_number'] = $validated['receipt_number'] ?? $transactionNumber; // Use transaction number if receipt number not provided
            $payment = CustPayment::create([
                'transaction_number' => $transactionNumber,
                'direction' => 'outgoing',
                'transaction_type' => 'refund',
                'amount_paid' => $amount,
                'tax_amount' => $taxPortion,
                'net_amount' => $netPortion,
                'payment_date' => $validated['date'],
                'payment_method' => $validated['payment_method'],
                'payment_status' => 'complete',
                'currency' => $invoiceCurrencyCode,
                'bank_name' => $validated['bank_name'] ?? null,
                'check_number' => $validated['check_number'] ?? null,
                'transaction_reference' => $validated['receipt_number'],
                'receipt_number' => $validated['receipt_number'], // Use transaction number as receipt number for refunds
                'exchange_rate' => $exchangeRate,
                'fee_or_charge' => 0.00,
                'invoice_total_amount' => $custCreditNote->total_amount,
                'reconciled' => false,
                'reconciliation_date' => null,
                'updated_by' => $userId,
                'created_by' => $userId
            ]);

            // Create corresponding customer ledger entry (refund against the credit note).
            // Entry intent in the account ledger:
            //   - Debit the selected financing account (cash/bank) by its account ID.
            //   - No explicit credit account here; the offset is the customer credit note.
            $ledger = CustomerTransactionsLedger::create([
                'cust_payment_id' => $payment->id,
                'transaction_number' => $payment->transaction_number,
                'transaction_type' => 'refund',
                'transaction_date' => $validated['date'],
                'posted_date' => now(),
                'amount' => $amount,
                'transaction_currency' => $invoiceCurrencyCode,
                'base_currency' => $baseCurrency,
                'exchange_rate' => $exchangeRate,
                'converted_amount' => $convertedAmount,
                'tax_amount' => $taxPortion,
                'converted_tax_amount' => $taxPortion * $exchangeRate,
                'net_amount' => $netPortion,
                'converted_net_amount' => $netPortion * $exchangeRate,
                'customer_id' => $custCreditNote->invoice?->customer_id,
                'source_type' => 'customer credit note',
                'source_id' => $custCreditNote->id,
                'account_debit' => (string) $account->id,
                'account_credit' => null,
                'category' => 'expense',
                'payment_method' => $validated['payment_method'] ?? null,
                'bank_account' => null,
                'check_number' => null,
                'transaction_status' => 'cleared',
                'related_transaction_id' => null,
                'narration' => 'Refund for Credit Note ' . $custCreditNote->credit_note_number,
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

            // Update financing account balance: debit decreases balance.
            $currentBalance = (float) $account->balance;
            $account->balance = (string) number_format($currentBalance - $amount, 2, '.', '');
            $account->updated_at = now();
            $account->updated_by = $userId;
            $account->save();

            // Treat any refund as fully refunded, single installment.
            $custCreditNote->status = 'refunded';
            $custCreditNote->updated_by = $userId;
            $custCreditNote->save();

            $custCreditNote->refresh();

            return $custCreditNote;
        });

        $custCreditNote->loadMissing(['invoice', 'items']);

        return (new CustCreditNoteResource($custCreditNote))->additional([
            'message' => 'Refund recorded successfully.',
        ]);
    }

    /**
     * Generate and download a PDF representation of the customer credit note.
     */
    public function downloadPdf(CustCreditNote $custCreditNote, Request $request)
    {
        $this->authorize('view', $custCreditNote);

        $pdf = $this->buildCustCreditNotePdf($custCreditNote, $request->user()?->id);

        return response()->streamDownload(
            function () use ($pdf) {
                echo $pdf['output'];
            },
            $pdf['fileName'],
            [
                'Content-Type' => 'application/pdf',
            ]
        );
    }

    /**
     * Send the customer credit note PDF to the customer via email.
     */
    public function sendEmail(CustCreditNote $custCreditNote, Request $request)
    {
        $this->authorize('view', $custCreditNote);

        $custCreditNote->loadMissing(['invoice.customer', 'invoice.project']);

        $customer = $custCreditNote->invoice?->customer;
        if (! $customer || empty($customer->email)) {
            return response()->json([
                'message' => 'Credit note customer email address is missing.',
            ], 422);
        }

        // Try to reuse an existing PDF for this credit note, if available
        $download = Download::where('name', $custCreditNote->credit_note_number)->first();

        if ($download && Storage::disk('public')->exists($download->path)) {
            $relativePath = $download->path;
            $fileName = basename($download->path);
        } else {
            $pdf = $this->buildCustCreditNotePdf($custCreditNote, $request->user()?->id);
            $relativePath = $pdf['relativePath'];
            $fileName = $pdf['fileName'];
        }

        $fullPath = Storage::disk('public')->path($relativePath);

        $recipientName = $customer->name ?? 'Customer';
        $projectName = $custCreditNote->invoice?->project?->name ?? null;
        $fromName = config('mail.from.name', config('app.name', 'EPMS'));

        $subject = sprintf(
            'Credit Note %s%s',
            $custCreditNote->credit_note_number,
            $projectName ? ' - ' . $projectName : ''
        );

        $mailData = [
            'creditNote'    => $custCreditNote,
            'recipientName' => $recipientName,
            'projectName'   => $projectName,
            'fromName'      => $fromName,
        ];

        try {
            Mail::send('emails.cust-credit-note', $mailData, function ($message) use ($customer, $recipientName, $subject, $fullPath, $fileName) {
                $message->to($customer->email, $recipientName)
                    ->subject($subject)
                    ->attach($fullPath, [
                        'as'   => $fileName,
                        'mime' => 'application/pdf',
                    ]);
            });
        } catch (\Throwable $e) {
            \Log::error('Failed to send customer credit note email', [
                'credit_note_id' => $custCreditNote->id,
                'error'      => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Failed to send credit note email to customer.',
            ], 500);
        }

        return response()->json([
            'message' => 'Credit note emailed to customer successfully.',
        ]);
    }

    /**
     * Build the customer credit note PDF, persist it to storage and track it in downloads.
     *
     * @return array{fileName: string, relativePath: string, output: string}
     */
    protected function buildCustCreditNotePdf(CustCreditNote $custCreditNote, ?int $userId = null): array
    {
        // Eager load invoice, items, and also fetch payments and ledgerRows for this credit note
        $custCreditNote->loadMissing([
            'invoice.project',
            'invoice.customer',
            'items',
        ]);

        // Fetch ledger rows for this credit note (refunds)
        $ledgerRows = \App\Models\CustomerTransactionsLedger::where('source_type', 'customer credit note')
            ->where('source_id', $custCreditNote->id)
            ->where('transaction_type', 'refund')
            ->where('is_deleted', false)
            ->get();
        $custCreditNote->ledgerRows = $ledgerRows;

        $configValues = \App\Models\SysConfig::whereIn('name', [
            'NAME',
            'EMAIL',
            'ADDRESS_LINE_1',
            'CITY',
            'STATE',
            'COUNTRY',
            'PHONE',
            'WEBSITE',
        ])->pluck('value', 'name');

        $senderName = $configValues['NAME'] ?? config('app.name', 'EPMS');
        $senderEmail = $configValues['EMAIL'] ?? config('mail.from.address', 'no-reply@example.com');
        $generatedAt = now();

        $data = [
            'creditNote'         => $custCreditNote,
            'senderName'         => $senderName,
            'senderEmail'        => $senderEmail,
            'senderPhone'        => $configValues['PHONE']   ?? null,
            'senderWebsite'      => $configValues['WEBSITE'] ?? config('app.url'),
            'senderAddressLine1' => $configValues['ADDRESS_LINE_1'] ?? null,
            'senderCity'         => $configValues['CITY']    ?? null,
            'senderState'        => $configValues['STATE']   ?? null,
            'senderCountry'      => $configValues['COUNTRY'] ?? null,
            'generatedAt'        => $generatedAt,
        ];

        $html = view('pdf.cust-credit-note', $data)->render();

        $options = new \Dompdf\Options();
        $options->set('isRemoteEnabled', true);

        $dompdf = new \Dompdf\Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $output = $dompdf->output();

        $fileName = $custCreditNote->credit_note_number . '.pdf';
        $relativePath = 'cust-credit-notes/' . $fileName;

        Storage::disk('public')->put($relativePath, $output);

        $download = Download::firstOrNew(['name' => $custCreditNote->credit_note_number]);
        $download->path = $relativePath;
        $download->updated_at = now();
        $download->updated_by = $userId;
        if (! $download->exists) {
            $download->created_at = now();
            $download->created_by = $userId;
        }
        $download->save();

        return [
            'fileName'     => $fileName,
            'relativePath' => $relativePath,
            'output'       => $output,
        ];
    }

    public function destroy(CustCreditNote $custCreditNote)
    {
        $this->authorize('delete', $custCreditNote);

        $this->service->delete($custCreditNote->id, Auth::id());
        return response()->noContent();
    }
}