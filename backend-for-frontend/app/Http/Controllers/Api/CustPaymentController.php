<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\CustPayment;
use App\Models\Download;
use App\Models\SysConfig;
use App\Services\CustPaymentService;
use App\Http\Resources\CustPaymentResource;
use App\Http\Requests\CustPaymentStoreRequest;
use App\Http\Requests\CustPaymentUpdateRequest;
use Dompdf\Dompdf;
use Dompdf\Options;

class CustPaymentController extends Controller
{
    protected CustPaymentService $service;

    public function __construct(CustPaymentService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', CustPayment::class);

        $perPage = (int) $request->get('per_page', 15);
        $page = (int) $request->get('page', 1);
        $filters = $request->except('per_page', 'page');

        $with = [
            'invoices.customer',
            'invoices.project',
            'createdByUser'
        ];

        $data = $this->service->index($filters, $perPage, $page, 0, $with);

        return CustPaymentResource::collection($data);
    }

    public function store(CustPaymentStoreRequest $request)
    {
        $this->authorize('create', CustPayment::class);

        $validated = $request->validated();
        $validated['created_by'] = Auth::id();

        $model = $this->service->create($validated);

        return new CustPaymentResource($model);
    }

    public function show(CustPayment $custPayment)
    {
        $this->authorize('view', $custPayment);

        $custPayment->loadMissing(['customerLedgerEntries', 'allocations', 'invoices', 'createdByUser']);

        return new CustPaymentResource($custPayment);
    }

    public function update(CustPaymentUpdateRequest $request, CustPayment $custPayment)
    {
        $this->authorize('update', $custPayment);

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();

        $updated = $this->service->update($custPayment->id, $validated);

        return new CustPaymentResource($updated);
    }

    public function destroy(CustPayment $custPayment)
    {
        $this->authorize('delete', $custPayment);

        $this->service->delete($custPayment->id, Auth::id());

        return response()->noContent();
    }

    /**
     * Generate and download a PDF representation of the customer payment.
     */
    public function downloadPdf(CustPayment $custPayment, Request $request)
    {
        $this->authorize('view', $custPayment);

        $pdf = $this->buildCustPaymentPdf($custPayment, $request->user()?->id);

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
     * Build the customer payment PDF, persist it to storage and track it in downloads.
     *
     * @return array{fileName: string, relativePath: string, output: string}
     */
    protected function buildCustPaymentPdf(CustPayment $payment, ?int $userId = null): array
    {
        $payment->loadMissing([
            'invoices.customer',
            'invoices.project',
            'allocations',
            'customerLedgerEntries.customer',
        ]);

        $configValues = SysConfig::whereIn('name', [
            'NAME',
            'EMAIL',
            'ADDRESS_LINE_1',
            'INSTANCE_LOGO',
            'CITY',
            'STATE',
            'COUNTRY',
            'PHONE',
            'WEBSITE',
        ])->pluck('value', 'name');

        $senderName = $configValues['NAME'] ?? config('app.name', 'EPMS');
        $senderEmail = $configValues['EMAIL'] ?? config('mail.from.address', 'no-reply@example.com');
        $generatedAt = now();

        $invoices = $payment->invoices ?? collect();
        $primaryInvoice = $invoices->first();

        $data = [
            'payment'            => $payment,
            'invoices'           => $invoices,
            'primaryInvoice'     => $primaryInvoice,
            'senderName'         => $senderName,
            'senderEmail'        => $senderEmail,
            'instanceLogo'      => $configValues['INSTANCE_LOGO'] ?? null,
            'senderPhone'        => $configValues['PHONE']   ?? null,
            'senderWebsite'      => $configValues['WEBSITE'] ?? config('app.url'),
            'senderAddressLine1' => $configValues['ADDRESS_LINE_1'] ?? null,
            'senderCity'         => $configValues['CITY']    ?? null,
            'senderState'        => $configValues['STATE']   ?? null,
            'senderCountry'      => $configValues['COUNTRY'] ?? null,
            'generatedAt'        => $generatedAt,
        ];

        $html = view('pdf.customer-payment', $data)->render();

        $options = new Options();
        $options->set('isRemoteEnabled', true);

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $output = $dompdf->output();

        $number = $payment->transaction_number ?: ('CUST-PAYMENT-' . $payment->id);
        $fileName = $number . '.pdf';
        $relativePath = 'cust-payments/' . $fileName;

        Storage::disk('public')->put($relativePath, $output);

        $downloadKey = 'cust-payment:' . $number;
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
