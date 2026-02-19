<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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
        $data = $this->service->index($request->all(), $perPage);
        return CompanyInvoiceResource::collection($data);
    }

    public function store(CompanyInvoiceStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
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

        $updated = $this->service->update($companyInvoice->id, $request->validated());
        return new CompanyInvoiceResource($updated);
    }

    public function destroy(CompanyInvoice $companyInvoice)
    {
        $this->authorize('delete', $companyInvoice);

        $this->service->delete($companyInvoice->id);
        return response()->noContent();
    }
}