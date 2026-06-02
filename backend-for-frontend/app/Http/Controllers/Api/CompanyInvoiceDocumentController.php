<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\CompanyInvoiceDocument;
use App\Models\CompanyInvoice;
use App\Services\CompanyInvoiceDocumentService;
use App\Http\Resources\CompanyInvoiceDocumentResource;
use App\Http\Requests\CompanyInvoiceDocumentStoreRequest;
use App\Http\Requests\CompanyInvoiceDocumentUpdateRequest;

class CompanyInvoiceDocumentController extends Controller
{
    protected $service;

    public function __construct(CompanyInvoiceDocumentService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\CompanyInvoiceDocument::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return CompanyInvoiceDocumentResource::collection($data);
    }

    public function store(CompanyInvoiceDocumentStoreRequest $request)
    {
        $this->authorize('create', \App\Models\CompanyInvoiceDocument::class);

        $validated = $request->validated();

        if (!empty($validated['invoice_id'])) {
            $invoice = CompanyInvoice::findOrFail($validated['invoice_id']);
            // No special lock behavior here; adjust if needed
        } else {
            $invoice = null;
        }

        if ($request->hasFile('document_file')) {
            $file = $request->file('document_file');

            $originalName = $file->getClientOriginalName();
            $prefix = $invoice ? $invoice->invoice_number : 'invoice';
            $fileName = $prefix . '-' . $originalName;

            $path = $file->storeAs('company-invoice-documents', $fileName, 'public');
            $validated['document_path'] = $path;
        }

        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);
        return new CompanyInvoiceDocumentResource($model);
    }

    public function show(CompanyInvoiceDocument $companyInvoiceDocument)
    {
        $this->authorize('view', $companyInvoiceDocument);

        return new CompanyInvoiceDocumentResource($companyInvoiceDocument);
    }

    public function update(CompanyInvoiceDocumentUpdateRequest $request, CompanyInvoiceDocument $companyInvoiceDocument)
    {
        $this->authorize('update', $companyInvoiceDocument);

        $validated = $request->validated();

        if ($request->hasFile('document_file')) {
            // Remove previous file if exists
            if ($companyInvoiceDocument->document_path && Storage::disk('public')->exists($companyInvoiceDocument->document_path)) {
                Storage::disk('public')->delete($companyInvoiceDocument->document_path);
            }

            $file = $request->file('document_file');
            $invoice = $companyInvoiceDocument->invoice ?? CompanyInvoice::find($companyInvoiceDocument->invoice_id);
            $originalName = $file->getClientOriginalName();
            $prefix = $invoice ? ($invoice->invoice_number ?? 'invoice') : 'invoice';
            $fileName = $prefix . '-' . $originalName;

            $path = $file->storeAs('company-invoice-documents', $fileName, 'public');
            $validated['document_path'] = $path;
        }

        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($companyInvoiceDocument->id, $validated);
        return new CompanyInvoiceDocumentResource($updated);
    }

    public function destroy(CompanyInvoiceDocument $companyInvoiceDocument)
    {
        $this->authorize('delete', $companyInvoiceDocument);

        // Optionally delete file from storage
        if ($companyInvoiceDocument->document_path && Storage::disk('public')->exists($companyInvoiceDocument->document_path)) {
            Storage::disk('public')->delete($companyInvoiceDocument->document_path);
        }

        $this->service->delete($companyInvoiceDocument->id);
        return response()->noContent();
    }

    public function download(CompanyInvoiceDocument $companyInvoiceDocument)
    {
        $this->authorize('view', $companyInvoiceDocument);

        if (!$companyInvoiceDocument->document_path) {
            return response()->json(['message' => 'Document file not found'], 404);
        }

        $disk = Storage::disk('public');

        if (!$disk->exists($companyInvoiceDocument->document_path)) {
            return response()->json(['message' => 'Document file missing on server'], 404);
        }

        $filename = basename($companyInvoiceDocument->document_path);

        return $disk->download($companyInvoiceDocument->document_path, $filename);
    }
}