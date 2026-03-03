<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\CustomerTransactionsLedger;
use App\Models\Download;
use App\Models\SysConfig;
use Dompdf\Dompdf;
use Dompdf\Options;
use App\Services\CustomerTransactionsLedgerService;
use App\Http\Resources\CustomerTransactionsLedgerResource;
use App\Http\Requests\CustomerTransactionsLedgerStoreRequest;
use App\Http\Requests\CustomerTransactionsLedgerUpdateRequest;

class CustomerTransactionsLedgerController extends Controller
{
    protected CustomerTransactionsLedgerService $service;

    public function __construct(CustomerTransactionsLedgerService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', CustomerTransactionsLedger::class);

        $perPage = (int) $request->get('per_page', 15);
        $page = (int) $request->get('page', 1);
        $filters = $request->except('per_page', 'page');

        $with = [
            'customer',
            'payment',
            'relatedTransaction',
        ];

        $data = $this->service->index($filters, $perPage, $page, 0, $with);

        return CustomerTransactionsLedgerResource::collection($data);
    }

    public function store(CustomerTransactionsLedgerStoreRequest $request)
    {
        $validated = $request->validated();
        $validated['created_by'] = Auth::id();

        $model = $this->service->create($validated);

        return new CustomerTransactionsLedgerResource($model);
    }

    public function show(CustomerTransactionsLedger $customerTransactionsLedger)
    {
        $this->authorize('view', $customerTransactionsLedger);

        $customerTransactionsLedger->loadMissing([
            'customer',
            'payment',
            'relatedTransaction',
        ]);

        return new CustomerTransactionsLedgerResource($customerTransactionsLedger);
    }

    public function update(CustomerTransactionsLedgerUpdateRequest $request, CustomerTransactionsLedger $customerTransactionsLedger)
    {
        $this->authorize('update', $customerTransactionsLedger);

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();

        $updated = $this->service->update($customerTransactionsLedger->id, $validated);

        return new CustomerTransactionsLedgerResource($updated);
    }

    public function destroy(CustomerTransactionsLedger $customerTransactionsLedger)
    {
        $this->authorize('delete', $customerTransactionsLedger);

        $this->service->delete($customerTransactionsLedger->id, Auth::id());

        return response()->noContent();
    }

    public function downloadPdf(CustomerTransactionsLedger $customerTransactionsLedger, Request $request)
    {
        $this->authorize('view', $customerTransactionsLedger);

        $pdf = $this->buildCustomerLedgerPdf($customerTransactionsLedger, $request->user()?->id);

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
     * Build the customer ledger entry PDF, persist it and track in downloads.
     *
     * @return array{fileName: string, relativePath: string, output: string}
     */
    protected function buildCustomerLedgerPdf(CustomerTransactionsLedger $entry, ?int $userId = null): array
    {
        $entry->loadMissing([
            'customer',
            'payment',
            'relatedTransaction',
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
            'entry'             => $entry,
            'senderName'        => $senderName,
            'senderEmail'       => $senderEmail,
            'senderPhone'       => $configValues['PHONE']   ?? null,
            'senderWebsite'     => $configValues['WEBSITE'] ?? config('app.url'),
            'senderAddressLine1'=> $configValues['ADDRESS_LINE_1'] ?? null,
            'senderCity'        => $configValues['CITY']    ?? null,
            'senderState'       => $configValues['STATE']   ?? null,
            'senderCountry'     => $configValues['COUNTRY'] ?? null,
            'generatedAt'       => $generatedAt,
        ];

        $html = view('pdf.customer-ledger-entry', $data)->render();

        $options = new Options();
        $options->set('isRemoteEnabled', true);

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $output = $dompdf->output();

        $number = $entry->transaction_number ?: ('CUST-LEDGER-' . $entry->id);
        $fileName = $number . '.pdf';
        $relativePath = 'customer-ledger/' . $fileName;

        Storage::disk('public')->put($relativePath, $output);

        $downloadKey = 'customer-ledger:' . $number;
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
