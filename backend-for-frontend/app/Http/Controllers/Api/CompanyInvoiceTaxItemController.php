<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\CompanyInvoiceTaxItem;
use App\Services\CompanyInvoiceTaxItemService;
use App\Http\Resources\CompanyInvoiceTaxItemResource;
use App\Http\Requests\CompanyInvoiceTaxItemStoreRequest;
use App\Http\Requests\CompanyInvoiceTaxItemUpdateRequest;

class CompanyInvoiceTaxItemController extends Controller
{
    protected $service;

    public function __construct(CompanyInvoiceTaxItemService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\CompanyInvoiceTaxItem::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return CompanyInvoiceTaxItemResource::collection($data);
    }

    public function store(CompanyInvoiceTaxItemStoreRequest $request)
    {
        $validated = $request->validated();
        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);
        return new CompanyInvoiceTaxItemResource($model);
    }

    public function show(CompanyInvoiceTaxItem $companyInvoiceTaxItem)
    {
        $this->authorize('view', $companyInvoiceTaxItem);

        return new CompanyInvoiceTaxItemResource($companyInvoiceTaxItem);
    }

    public function update(CompanyInvoiceTaxItemUpdateRequest $request, CompanyInvoiceTaxItem $companyInvoiceTaxItem)
    {
        $this->authorize('update', $companyInvoiceTaxItem);

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($companyInvoiceTaxItem->id, $validated);
        return new CompanyInvoiceTaxItemResource($updated);
    }

    public function destroy(CompanyInvoiceTaxItem $companyInvoiceTaxItem)
    {
        $this->authorize('delete', $companyInvoiceTaxItem);

        $this->service->delete($companyInvoiceTaxItem->id);
        return response()->noContent();
    }
}