<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CompanyInvoiceDucoment;
use App\Services\CompanyInvoiceDucomentService;
use App\Http\Resources\CompanyInvoiceDucomentResource;
use App\Http\Requests\CompanyInvoiceDucomentStoreRequest;
use App\Http\Requests\CompanyInvoiceDucomentUpdateRequest;

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
        $model = $this->service->create($request->validated());
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

        $updated = $this->service->update($companyInvoiceDocument->id, $request->validated());
        return new CompanyInvoiceDocumentResource($updated);
    }

    public function destroy(CompanyInvoiceDocument $companyInvoiceDocument)
    {
        $this->authorize('delete', $companyInvoiceDocument);

        $this->service->delete($companyInvoiceDocument->id);
        return response()->noContent();
    }
}