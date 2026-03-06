<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\CompanyPayment;
use App\Models\Download;
use App\Models\SysConfig;
use App\Services\CompanyPaymentService;
use App\Http\Resources\CompanyPaymentResource;
use App\Http\Requests\CompanyPaymentStoreRequest;
use App\Http\Requests\CompanyPaymentUpdateRequest;
use Dompdf\Dompdf;
use Dompdf\Options;

class CompanyPaymentController extends Controller
{
    protected $service;

    public function __construct(CompanyPaymentService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\CompanyPayment::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $with = [
            'invoice.company',
            'invoice.project',
        ];

        $data = $this->service->index($filters, $perPage, $page, 0, $with);
        return CompanyPaymentResource::collection($data);
    }

    public function store(CompanyPaymentStoreRequest $request)
    {
        $validated = $request->validated();
        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);
        return new CompanyPaymentResource($model);
    }

    public function show(CompanyPayment $companyPayment)
    {
        $this->authorize('view', $companyPayment);

        return new CompanyPaymentResource($companyPayment);
    }

    public function update(CompanyPaymentUpdateRequest $request, CompanyPayment $companyPayment)
    {
        $this->authorize('update', $companyPayment);

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($companyPayment->id, $validated);
        return new CompanyPaymentResource($updated);
    }

    public function destroy(CompanyPayment $companyPayment)
    {
        $this->authorize('delete', $companyPayment);

        $this->service->delete($companyPayment->id, Auth::id());
        return response()->noContent();
    }

    /**
     * Generate and download a PDF representation of the company payment.
     */
    public function downloadPdf(CompanyPayment $companyPayment, Request $request)
    {
        $this->authorize('view', $companyPayment);

        $pdf = $this->buildCompanyPaymentPdf($companyPayment, $request->user()?->id);

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
     * Build the company payment PDF, persist it to storage and track it in downloads.
     *
     * @return array{fileName: string, relativePath: string, output: string}
     */
    protected function buildCompanyPaymentPdf(CompanyPayment $payment, ?int $userId = null): array
    {
        $payment->loadMissing([
            'invoice.company',
            'invoice.project',
            'companyLedgerEntries.company',
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

        $invoice = $payment->invoice;

        $data = [
            'payment'            => $payment,
            'invoice'            => $invoice,
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

        $html = view('pdf.company-payment', $data)->render();

        $options = new Options();
        $options->set('isRemoteEnabled', true);

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $output = $dompdf->output();

        $number = $payment->transaction_number ?: ('COMP-PAYMENT-' . $payment->id);
        $fileName = $number . '.pdf';
        $relativePath = 'company-payments/' . $fileName;

        Storage::disk('public')->put($relativePath, $output);

        $downloadKey = 'company-payment:' . $number;
        $download = Download::firstOrNew(['name' => $downloadKey]);
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