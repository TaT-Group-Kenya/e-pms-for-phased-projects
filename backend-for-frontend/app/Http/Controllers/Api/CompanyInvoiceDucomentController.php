<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CompanyInvoiceDucoment;
use App\Services\CompanyInvoiceDucomentService;
use App\Http\Resources\CompanyInvoiceDucomentResource;
use App\Http\Requests\CompanyInvoiceDucomentStoreRequest;
use App\Http\Requests\CompanyInvoiceDucomentUpdateRequest;

class CompanyInvoiceDucomentController extends Controller
{
    protected $service;

    public function __construct(CompanyInvoiceDucomentService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\CompanyInvoiceDucoment::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return CompanyInvoiceDucomentResource::collection($data);
    }

    public function store(CompanyInvoiceDucomentStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
        return new CompanyInvoiceDucomentResource($model);
    }

    public function show(CompanyInvoiceDucoment $companyInvoiceDucoment)
    {
        $this->authorize('view', $companyInvoiceDucoment);

        return new CompanyInvoiceDucomentResource($companyInvoiceDucoment);
    }

    public function update(CompanyInvoiceDucomentUpdateRequest $request, CompanyInvoiceDucoment $companyInvoiceDucoment)
    {
        $this->authorize('update', $companyInvoiceDucoment);

        $updated = $this->service->update($companyInvoiceDucoment->id, $request->validated());
        return new CompanyInvoiceDucomentResource($updated);
    }

    public function destroy(CompanyInvoiceDucoment $companyInvoiceDucoment)
    {
        $this->authorize('delete', $companyInvoiceDucoment);

        $this->service->delete($companyInvoiceDucoment->id);
        return response()->noContent();
    }
}