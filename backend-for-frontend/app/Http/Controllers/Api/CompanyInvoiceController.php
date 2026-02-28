<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\CompanyInvoice;
use App\Models\CompanyPayment;
use App\Models\CompanyTransactionsLedger;
use App\Services\CurrencyConversionService;
use App\Models\Account;
use App\Models\CompanyProject;
use App\Models\ProjectPhase;
use App\Models\Download;
use App\Models\SysConfig;
use App\Services\CommonService;
use App\Services\CompanyInvoiceService;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use App\Http\Resources\CompanyInvoiceResource;
use App\Http\Requests\CompanyInvoiceStoreRequest;
use App\Http\Requests\CompanyInvoiceUpdateRequest;

class CompanyInvoiceController extends Controller
{
    protected $service;

    public function __construct(CompanyInvoiceService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\CompanyInvoice::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return CompanyInvoiceResource::collection($data);
    }

    public function store(CompanyInvoiceStoreRequest $request)
    {
        $validated = $request->validated();
        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);
        return new CompanyInvoiceResource($model);
    }

    /**
     * Create a draft company invoice from a completed project phase assignment.
     *
     * The UI selects a company and one of its completed assigned project phases;
     * this endpoint generates a draft invoice header with zero financial amounts.
     * Amounts and line items can then be edited on the invoice detail screen.
     */
    public function createFromPhase(Request $request)
    {
        $this->authorize('create', CompanyInvoice::class);

        $data = $request->validate([
            'company_id'       => ['required', 'integer', 'exists:companies,id'],
            'project_phase_id' => ['required', 'integer', 'exists:project_phases,id'],
            'title'            => ['nullable', 'string'],
            'description'      => ['nullable', 'string'],
            'payment_terms'    => ['nullable', 'string'],
            'notes_to_customer'=> ['nullable', 'string'],
        ]);

        $phase = ProjectPhase::with('project')->findOrFail($data['project_phase_id']);

        // Ensure this phase is assigned to the selected company and is marked complete.
        $assignment = CompanyProject::where('company_id', $data['company_id'])
            ->where('phase_id', $phase->id)
            ->where('is_complete', true)
            ->first();

        if (! $assignment) {
            return response()->json([
                'message' => 'Selected phase is not a completed assignment for this company.',
                'errors'  => [
                    'project_phase_id' => ['Phase must be assigned to the selected company and marked complete.'],
                ],
            ], 422);
        }

        // Prevent duplicate invoices for the same company and project phase.
        $existingInvoice = CompanyInvoice::where('company_id', $data['company_id'])
            ->where('project_phase_id', $phase->id)
            ->where('is_deleted', false)
            ->first();

        if ($existingInvoice) {
            return response()->json([
                'message' => 'An invoice already exists for this company and project phase.',
                'errors'  => [
                    'project_phase_id' => ['Only one company invoice is allowed per company and project phase.'],
                ],
            ], 422);
        }

        $commonService = new CommonService();

        // Generate a unique invoice number for the company invoice.
        do {
            $invoiceNumber = $commonService->generateUniqueCode('CMPINV-');
        } while (CompanyInvoice::where('invoice_number', $invoiceNumber)->exists());

        $project = $phase->project;

        $invoice = DB::transaction(function () use ($data, $phase, $project, $invoiceNumber) {
            return CompanyInvoice::create([
                'invoice_number'      => $invoiceNumber,
                'project_id'          => $project ? $project->id : null,
                'company_id'          => $data['company_id'],
                'project_phase_id'    => $phase->id,
                'title'               => $data['title'] ?? $phase->name,
                'description'         => $data['description'] ?? ($phase->description ?? ''),
                'status'              => 'draft',
                'subtotal_amount'     => 0,
                'tax_amount'          => 0,
                'discount_percentage' => '0',
                'discount_amount'     => 0,
                'total_amount'        => 0,
                'currency'            => $project ? ($project->currency ?? 'USD') : 'USD',
                'payment_terms'       => $data['payment_terms'] ?? '',
                'notes_to_customer'   => $data['notes_to_customer'] ?? '',
                'valid_until'         => now()->addDays(30),
                'created_at'          => now(),
                'updated_at'          => now(),
                'created_by'          => Auth::id(),
                'updated_by'          => Auth::id(),
                'is_deleted'          => false,
            ]);
        });

        $invoice->loadMissing([
            'project',
            'invoiceItems.projectPhase',
            'taxitems',
            'payments',
            'creditnotes',
            'documents',
        ]);

        return new CompanyInvoiceResource($invoice);
    }

    public function show(CompanyInvoice $companyInvoice)
    {
        $this->authorize('view', $companyInvoice);

        $companyInvoice->loadMissing([
            'project',
            'invoiceItems.projectPhase',
            'taxitems',
            'payments',
            'creditnotes',
            'documents',
        ]);

        return new CompanyInvoiceResource($companyInvoice);
    }

    /**
     * Record a payment against a company invoice and create a corresponding
     * company transactions ledger entry with tax/net split.
     */
    public function addPayment(Request $request, CompanyInvoice $companyInvoice)
    {
        $this->authorize('update', $companyInvoice);

        if ($companyInvoice->status !== 'sent') {
            return response()->json([
                'message' => 'Payments can only be added to invoices in sent status.',
                'errors'  => [
                    'status' => ['Invoice must be in sent status to add payments.'],
                ],
            ], 422);
        }

        $validated = $request->validate([
            'amount_paid' => ['required', 'numeric', 'min:0.01'],
            'payment_date' => ['required', 'date'],
            'payment_method' => ['required', 'string', 'max:255'],
            'payment_status' => ['required', Rule::in(['pending', 'complete'])],
            'bank_name' => ['nullable', 'string', 'max:255'],
            'check_number' => ['nullable', 'string', 'max:255'],
            'receipt_number' => ['required', 'string', 'max:255'],
            'account_id' => ['required', 'integer', 'exists:accounts,id,is_deleted,0'],
        ]);

        $invoice = $companyInvoice;

        $invoice = DB::transaction(function () use ($invoice, $validated) {
            $amountPaid = (float) $validated['amount_paid'];

            $account = Account::findOrFail($validated['account_id']);

            $invoiceTotal = (float) $invoice->total_amount;
            $invoiceTaxTotal = (float) $invoice->tax_amount;

            if ($invoiceTotal > 0 && $invoiceTaxTotal > 0) {
                $taxPortion = min(
                    round(($invoiceTaxTotal / $invoiceTotal) * $amountPaid, 2),
                    $amountPaid
                );
            } else {
                $taxPortion = 0.0;
            }

            $netPortion = $amountPaid - $taxPortion;

            // Determine base (account) currency and invoice currency
            $accountCurrencyCode = $account->currency ?? 'KES';
            $invoiceCurrencyCode = $invoice->currency;

            // Use shared conversion helper: 1 invoice currency unit = exchange_rate * base currency units
            $conversionService = new CurrencyConversionService();
            $conversion = $conversionService->convertToBaseFromInvoice($amountPaid, $invoiceCurrencyCode, $accountCurrencyCode);
            $exchangeRate = $conversion['exchange_rate'];
            $convertedAmount = $conversion['converted_amount'];

            $currentBalance = (float) $account->balance;

            if (! (bool) $account->overdraft_allowed && $currentBalance < $convertedAmount) {
                throw ValidationException::withMessages([
                    'account_id' => ['Selected account does not have sufficient balance and overdraft is not allowed.'],
                ]);
            }

            $payment = CompanyPayment::create([
                'invoice_id' => $invoice->id,
                'amount_paid' => $amountPaid,
                'tax_amount' => $taxPortion,
                'net_amount' => $netPortion,
                'payment_date' => $validated['payment_date'],
                'payment_method' => $validated['payment_method'],
                'payment_status' => $validated['payment_status'],
                'currency' => $invoiceCurrencyCode,
                'exchange_rate' => $exchangeRate,
                'bank_name' => $validated['bank_name'] ?? null,
                'check_number' => $validated['check_number'] ?? null,
                'transaction_reference' => $validated['receipt_number'],
                'receipt_number' => $validated['receipt_number'],
                'reconciled' => false,
                'reconciliation_date' => null,
                'created_by' => Auth::id(),
                'updated_by' => Auth::id(),
            ]);

            CompanyTransactionsLedger::create([
                'company_payment_id' => $payment->id,
                'transaction_number' => $payment->transaction_number ?? null,
                'transaction_type' => 'payment',
                'transaction_date' => $validated['payment_date'],
                'posted_date' => now(),
                'amount' => $amountPaid,
                'transaction_currency' => $invoiceCurrencyCode,
                'base_currency' => $accountCurrencyCode,
                'exchange_rate' => $exchangeRate,
                'converted_amount' => $convertedAmount,
                'converted_tax_amount' => $taxPortion * $exchangeRate,
                'converted_net_amount' => $netPortion * $exchangeRate,
                'tax_amount' => $taxPortion,
                'net_amount' => $netPortion,
                'company_id' => $invoice->company_id,
                'customer_id' => null,
                'source_type' => 'company_invoice',
                'source_id' => $invoice->id,
                'account_debit' => $account->id,
                'account_credit' => null,
                'category' => 'expense',
                'payment_method' => $validated['payment_method'],
                'bank_account' => $validated['bank_name'] ?? null,
                'check_number' => $validated['check_number'] ?? null,
                'transaction_status' => $validated['payment_status'] === 'complete' ? 'cleared' : 'pending',
                'related_transaction_id' => $validated['related_transaction_id'] ?? null,
                'narration' => 'Payment for company invoice ' . $invoice->invoice_number,
                'is_recurring' => false,
                'fiscal_year' => now()->year,
                'accounting_period' => now()->format('Ym'),
                'is_adjusting_entry' => false,
                'cost_center_id' => null,
                'created_by' => Auth::id(),
                'updated_by' => Auth::id(),
            ]);

            // Update accounts account balance: debit decreases balance
            $account->balance = (string) number_format($currentBalance - $convertedAmount, 2, '.', '');
            $account->updated_at = now();
            $account->updated_by = Auth::id();
            $account->save();

            $invoice->refresh();

            return $invoice;
        });

        $invoice->loadMissing([
            'project',
            'invoiceItems.projectPhase',
            'taxitems',
            'payments',
            'creditnotes',
            'documents',
        ]);

        return new CompanyInvoiceResource($invoice);
    }

    public function update(CompanyInvoiceUpdateRequest $request, CompanyInvoice $companyInvoice)
    {
        $this->authorize('update', $companyInvoice);

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($companyInvoice->id, $validated);
        return new CompanyInvoiceResource($updated);
    }

    public function destroy(CompanyInvoice $companyInvoice)
    {
        $this->authorize('delete', $companyInvoice);

        $this->service->delete($companyInvoice->id);
        return response()->noContent();
    }

    /**
     * Generate and download a PDF representation of the company invoice.
     */
    public function downloadPdf(CompanyInvoice $companyInvoice, Request $request)
    {
        $this->authorize('view', $companyInvoice);

        $pdf = $this->buildCompanyInvoicePdf($companyInvoice, $request->user()?->id);

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
     * Send the company invoice PDF via email.
     */
    public function sendEmail(CompanyInvoice $companyInvoice, Request $request)
    {
        $this->authorize('view', $companyInvoice);

        $companyInvoice->loadMissing(['project.company']);

        $recipientEmail = $companyInvoice->project->company->email ?? null;
        $recipientName = $companyInvoice->project->company->name ?? 'Company';

        if (! $recipientEmail) {
            return response()->json([
                'message' => 'Company email address is missing for this invoice.',
            ], 422);
        }

        // Try to reuse an existing PDF for this invoice, if available
        $download = Download::where('name', $companyInvoice->invoice_number)->first();

        if ($download && Storage::disk('public')->exists($download->path)) {
            $relativePath = $download->path;
            $fileName = basename($download->path);
        } else {
            $pdf = $this->buildCompanyInvoicePdf($companyInvoice, $request->user()?->id);
            $relativePath = $pdf['relativePath'];
            $fileName = $pdf['fileName'];
        }

        $fullPath = Storage::disk('public')->path($relativePath);

        $projectName = $companyInvoice->project->name ?? null;
        $fromName = config('mail.from.name', config('app.name', 'EPMS'));

        $subject = sprintf(
            'Company Invoice %s%s',
            $companyInvoice->invoice_number,
            $projectName ? ' - ' . $projectName : ''
        );

        $mailData = [
            'invoice'       => $companyInvoice,
            'recipientName' => $recipientName,
            'projectName'   => $projectName,
            'fromName'      => $fromName,
        ];

        try {
            Mail::send('emails.company-invoice', $mailData, function ($message) use ($recipientEmail, $recipientName, $subject, $fullPath, $fileName) {
                $message->to($recipientEmail, $recipientName)
                    ->subject($subject)
                    ->attach($fullPath, [
                        'as'   => $fileName,
                        'mime' => 'application/pdf',
                    ]);
            });
        } catch (\Throwable $e) {
            \Log::error('Failed to send company invoice email', [
                'company_invoice_id' => $companyInvoice->id,
                'error'              => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Failed to send company invoice email.',
            ], 500);
        }

        return response()->json([
            'message' => 'Company invoice emailed successfully.',
        ]);
    }

    /**
     * Build the company invoice PDF, persist it to storage and track it in downloads.
     *
     * @return array{fileName: string, relativePath: string, output: string}
     */
    protected function buildCompanyInvoicePdf(CompanyInvoice $companyInvoice, ?int $userId = null): array
    {
        $companyInvoice->loadMissing([
            'project.company',
            'invoiceItems',
            'taxitems',
            'documents',
        ]);

        $configValues = SysConfig::whereIn('name', [
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
            'invoice'            => $companyInvoice,
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

        $html = view('pdf.company-invoice', $data)->render();

        $options = new \Dompdf\Options();
        $options->set('isRemoteEnabled', true);

        $dompdf = new \Dompdf\Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $output = $dompdf->output();

        $fileName = $companyInvoice->invoice_number . '.pdf';
        $relativePath = 'company-invoices/' . $fileName;

        Storage::disk('public')->put($relativePath, $output);

        $download = Download::firstOrNew(['name' => $companyInvoice->invoice_number]);
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
}