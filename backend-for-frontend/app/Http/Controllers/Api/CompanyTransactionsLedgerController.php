<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\CompanyTransactionsLedger;
use App\Models\Download;
use App\Models\SysConfig;
use Dompdf\Dompdf;
use Dompdf\Options;
use App\Services\CompanyTransactionsLedgerService;
use App\Http\Resources\CompanyTransactionsLedgerResource;
use App\Http\Requests\CompanyTransactionsLedgerStoreRequest;
use App\Http\Requests\CompanyTransactionsLedgerUpdateRequest;

class CompanyTransactionsLedgerController extends Controller
{
    protected CompanyTransactionsLedgerService $service;

    public function __construct(CompanyTransactionsLedgerService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', CompanyTransactionsLedger::class);

        $perPage = (int) $request->get('per_page', 15);
        $page = (int) $request->get('page', 1);
        $filters = $request->except('per_page', 'page');

        $data = $this->service->index($filters, $perPage, $page);

        return CompanyTransactionsLedgerResource::collection($data);
    }

    public function store(CompanyTransactionsLedgerStoreRequest $request)
    {
        $validated = $request->validated();
        $validated['created_by'] = Auth::id();

        $model = $this->service->create($validated);

        return new CompanyTransactionsLedgerResource($model);
    }

    public function show(CompanyTransactionsLedger $companyTransactionsLedger)
    {
        $this->authorize('view', $companyTransactionsLedger);

        return new CompanyTransactionsLedgerResource($companyTransactionsLedger);
    }

    public function update(CompanyTransactionsLedgerUpdateRequest $request, CompanyTransactionsLedger $companyTransactionsLedger)
    {
        $this->authorize('update', $companyTransactionsLedger);

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();

        $updated = $this->service->update($companyTransactionsLedger->id, $validated);

        return new CompanyTransactionsLedgerResource($updated);
    }

    public function destroy(CompanyTransactionsLedger $companyTransactionsLedger)
    {
        $this->authorize('delete', $companyTransactionsLedger);

        $this->service->delete($companyTransactionsLedger->id, Auth::id());

        return response()->noContent();
    }

    public function downloadPdf(CompanyTransactionsLedger $companyTransactionsLedger, Request $request)
    {
        $this->authorize('view', $companyTransactionsLedger);

        $pdf = $this->buildCompanyLedgerPdf($companyTransactionsLedger, $request->user()?->id);

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
     * Build the company ledger entry PDF, persist it and track in downloads.
     *
     * @return array{fileName: string, relativePath: string, output: string}
     */
    protected function buildCompanyLedgerPdf(CompanyTransactionsLedger $entry, ?int $userId = null): array
    {
        $entry->loadMissing([
            'company',
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

        $html = view('pdf.company-ledger-entry', $data)->render();

        $options = new Options();
        $options->set('isRemoteEnabled', true);

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $output = $dompdf->output();

        $number = $entry->transaction_number ?: ('COMP-LEDGER-' . $entry->id);
        $fileName = $number . '.pdf';
        $relativePath = 'company-ledger/' . $fileName;

        Storage::disk('public')->put($relativePath, $output);

        $downloadKey = 'company-ledger:' . $number;
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
