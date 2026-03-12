<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\CompanyCreditNote;
use App\Models\CompanyInvoice;
use App\Services\CompanyCreditNoteService;
use App\Services\CommonService;
use App\Http\Resources\CompanyCreditNoteResource;
use App\Http\Requests\CompanyCreditNoteStoreRequest;
use App\Http\Requests\CompanyCreditNoteUpdateRequest;

class CompanyCreditNoteController extends Controller
{
    protected $service;

    public function __construct(CompanyCreditNoteService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\CompanyCreditNote::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return CompanyCreditNoteResource::collection($data);
    }

    public function store(CompanyCreditNoteStoreRequest $request)
    {
        $this->authorize('create', \App\Models\CompanyCreditNote::class);
        $validated = $request->validated();

        if (!empty($validated['invoice_id'])) {
            $invoice = CompanyInvoice::find($validated['invoice_id']);

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

        // Auto-generate a unique credit note number if not provided
        if (empty($validated['credit_note_number'] ?? null)) {
            $commonService = new CommonService();

            do {
                $number = $commonService->generateUniqueCode('CMPCN-');
            } while (CompanyCreditNote::where('credit_note_number', $number)->exists());

            $validated['credit_note_number'] = $number;
        }

        $validated['created_by'] = Auth::id();

        $model = $this->service->create($validated);
        return new CompanyCreditNoteResource($model);
    }

    public function show(CompanyCreditNote $companyCreditNote)
    {
        $this->authorize('view', $companyCreditNote);

        $companyCreditNote->loadMissing([
            'invoice',
            'items',
        ]);

        return new CompanyCreditNoteResource($companyCreditNote);
    }

    public function update(CompanyCreditNoteUpdateRequest $request, CompanyCreditNote $companyCreditNote)
    {
        $this->authorize('update', $companyCreditNote);

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($companyCreditNote->id, $validated);
        $updated->loadMissing([
            'invoice',
            'items',
        ]);
        return new CompanyCreditNoteResource($updated);
    }

    public function refund(Request $request, CompanyCreditNote $companyCreditNote)
    {
        $this->authorize('update', $companyCreditNote);

        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:0.01'],
            'date' => ['required', 'date'],
            'receiving_account' => ['required', 'integer', 'exists:accounts,id'],
            'narration' => ['nullable', 'string'],
        ]);

        $validated['payment_method'] = 'bank_transfer';

        if (strtolower($companyCreditNote->status) !== 'raised') {
            return response()->json([
                'message' => 'Only raised credit notes can be refunded.',
            ], 422);
        }

        $existingRefund = \App\Models\CompanyTransactionsLedger::where('source_type', 'company credit note')
            ->where('source_id', $companyCreditNote->id)
            ->where('transaction_type', 'refund')
            ->where('is_deleted', false)
            ->exists();

        if ($existingRefund) {
            return response()->json([
                'message' => 'This credit note already has a recorded refund.',
            ], 422);
        }

        $amount = (float) $validated['amount'];
        $creditNoteTotal = (float) $companyCreditNote->total_amount;

        if (abs($amount - $creditNoteTotal) > 0.009) {
            return response()->json([
                'message' => 'Refund amount must equal the full credit note total.',
            ], 422);
        }

        $userId = $request->user()?->id;

        $account = \App\Models\Account::findOrFail($validated['receiving_account']);

        if ($account->currency !== $companyCreditNote->currency) {
            return response()->json([
                'message' => 'Receiving account currency must match the credit note currency.',
            ], 422);
        }

        $invoiceCurrencyCode = $companyCreditNote->currency;
        $baseCurrencyForLocalTaxationCode = 'KES';

        $conversionService = new \App\Services\CurrencyConversionService();
        $conversion = $conversionService->convertToBaseFromInvoice(
            $amount,
            $invoiceCurrencyCode,
            $baseCurrencyForLocalTaxationCode
        );

        $exchangeRate = $conversion['exchange_rate'];
        $convertedAmount = $conversion['converted_amount'];
        $baseCurrency = $conversion['base_currency'];

        $companyCreditNote = \DB::transaction(function () use (
            $companyCreditNote,
            $validated,
            $amount,
            $invoiceCurrencyCode,
            $baseCurrency,
            $exchangeRate,
            $convertedAmount,
            $account,
            $userId
        ) {
            $commonService = new \App\Services\CommonService();

            do {
                $transactionNumber = $commonService->generateUniqueCode('CMPREF-');
            } while (\App\Models\CompanyPayment::where('transaction_number', $transactionNumber)->exists());

            $taxPortion = (float) $companyCreditNote->tax_amount;
            $netPortion = (float) $companyCreditNote->subtotal_amount;
            if ($netPortion === 0.0 && $taxPortion > 0.0) {
                $netPortion = (float) $companyCreditNote->total_amount - $taxPortion;
            }
            if (abs(($netPortion + $taxPortion) - (float) $companyCreditNote->total_amount) > 0.01) {
                $netPortion = (float) $companyCreditNote->total_amount;
                $taxPortion = 0.0;
            }

            $validated['receipt_number'] = $validated['receipt_number'] ?? $transactionNumber;
            $payment = \App\Models\CompanyPayment::create([
                'transaction_number' => $transactionNumber,
                'direction' => 'incoming',
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
                'receipt_number' => $validated['receipt_number'],
                'exchange_rate' => $exchangeRate,
                'reconciled' => false,
                'reconciliation_date' => null,
                'updated_by' => $userId,
                'created_by' => $userId
            ]);

            $ledger = \App\Models\CompanyTransactionsLedger::create([
                'company_payment_id' => $payment->id,
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
                'company_id' => $companyCreditNote->invoice?->company_id,
                'customer_id' => $companyCreditNote->invoice?->customer_id,
                'source_type' => 'company credit note',
                'source_id' => $companyCreditNote->id,
                'account_debit' => null,
                'account_credit' => (string) $account->id,
                    'category' => 'revenue',
                'payment_method' => $validated['payment_method'] ?? null,
                'bank_account' => null,
                'check_number' => null,
                'transaction_status' => 'cleared',
                'related_transaction_id' => null,
                'narration' => 'Refund for Company Credit Note ' . $companyCreditNote->credit_note_number,
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

            $currentBalance = (float) $account->balance;
            $account->balance = (string) number_format($currentBalance + $amount, 2, '.', '');
            $account->updated_at = now();
            $account->updated_by = $userId;
            $account->save();

            $companyCreditNote->status = 'refunded';
            $companyCreditNote->updated_by = $userId;
            $companyCreditNote->save();

            $companyCreditNote->refresh();

            return $companyCreditNote;
        });

        $companyCreditNote->loadMissing(['invoice', 'items']);

        return (new CompanyCreditNoteResource($companyCreditNote))->additional([
            'message' => 'Refund recorded successfully.',
        ]);
    }

    /**
     * Generate and download a PDF representation of the company credit note.
     */
    public function downloadPdf(CompanyCreditNote $companyCreditNote, Request $request)
    {
        $this->authorize('view', $companyCreditNote);

        $pdf = $this->buildCompanyCreditNotePdf($companyCreditNote, $request->user()?->id);

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
     * Send the company credit note PDF to the company via email.
     */
    public function sendEmail(CompanyCreditNote $companyCreditNote, Request $request)
    {
        $this->authorize('view', $companyCreditNote);

        $companyCreditNote->loadMissing(['invoice.company', 'invoice.project']);

        $company = $companyCreditNote->invoice?->company;
        if (! $company || empty($company->email)) {
            return response()->json([
                'message' => 'Credit note company email address is missing.',
            ], 422);
        }

        $download = \App\Models\Download::where('name', $companyCreditNote->credit_note_number)->first();

        if ($download && \Storage::disk('public')->exists($download->path)) {
            $relativePath = $download->path;
            $fileName = basename($download->path);
        } else {
            $pdf = $this->buildCompanyCreditNotePdf($companyCreditNote, $request->user()?->id);
            $relativePath = $pdf['relativePath'];
            $fileName = $pdf['fileName'];
        }

        $fullPath = \Storage::disk('public')->path($relativePath);

        $recipientName = $company->name ?? 'Company';
        $projectName = $companyCreditNote->invoice?->project?->name ?? null;
        $fromName = config('mail.from.name', config('app.name', 'EPMS'));

        $subject = sprintf(
            'Company Credit Note %s%s',
            $companyCreditNote->credit_note_number,
            $projectName ? ' - ' . $projectName : ''
        );

        $mailData = [
            'creditNote'    => $companyCreditNote,
            'recipientName' => $recipientName,
            'projectName'   => $projectName,
            'fromName'      => $fromName,
        ];

        try {
            // Use the correct view path for the email template
            \Mail::send('emails.company-credit-note', $mailData, function ($message) use ($company, $recipientName, $subject, $fullPath, $fileName) {
                $message->to($company->email, $recipientName)
                    ->subject($subject)
                    ->attach($fullPath, [
                        'as'   => $fileName,
                        'mime' => 'application/pdf',
                    ]);
            });
        } catch (\Throwable $e) {
            \Log::error('Failed to send company credit note email', [
                'company_credit_note_id' => $companyCreditNote->id,
                'error'      => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Failed to send credit note email to company.',
            ], 500);
        }

        return response()->json([
            'message' => 'Company credit note emailed to company successfully.',
        ]);
    }

    /**
     * Build the company credit note PDF, persist it to storage and track it in downloads.
     *
     * @return array{fileName: string, relativePath: string, output: string}
     */
    protected function buildCompanyCreditNotePdf(CompanyCreditNote $companyCreditNote, ?int $userId = null): array
    {
        $companyCreditNote->loadMissing([
            'invoice.project',
            'invoice.company',
            'items',
        ]);

        // Fetch ledger rows for this company credit note (refunds)
        $ledgerRows = \App\Models\CompanyTransactionsLedger::where('source_type', 'company credit note')
            ->where('source_id', $companyCreditNote->id)
            ->where('transaction_type', 'refund')
            ->where('is_deleted', false)
            ->get();
        $companyCreditNote->ledgerRows = $ledgerRows;

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
            'creditNote'         => $companyCreditNote,
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

        $html = view('pdf.company-credit-note', $data)->render();

        $options = new \Dompdf\Options();
        $options->set('isRemoteEnabled', true);

        $dompdf = new \Dompdf\Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $output = $dompdf->output();

        $fileName = $companyCreditNote->credit_note_number . '.pdf';
        $relativePath = 'company-credit-notes/' . $fileName;

        \Storage::disk('public')->put($relativePath, $output);

        $download = \App\Models\Download::firstOrNew(['name' => $companyCreditNote->credit_note_number]);
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

    public function destroy(CompanyCreditNote $companyCreditNote)
    {
        $this->authorize('delete', $companyCreditNote);

        $this->service->delete($companyCreditNote->id, Auth::id());
        return response()->noContent();
    }
}