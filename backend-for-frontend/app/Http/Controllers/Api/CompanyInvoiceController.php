<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\CompanyInvoice;
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
}