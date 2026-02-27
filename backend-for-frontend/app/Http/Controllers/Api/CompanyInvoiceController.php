<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\CompanyInvoice;
use App\Models\Download;
use App\Models\SysConfig;
use App\Services\CompanyInvoiceService;
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