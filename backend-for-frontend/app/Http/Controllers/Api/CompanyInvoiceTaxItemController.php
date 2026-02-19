<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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
        $data = $this->service->index($request->all(), $perPage);
        return CompanyInvoiceTaxItemResource::collection($data);
    }

    public function store(CompanyInvoiceTaxItemStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
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

        $updated = $this->service->update($companyInvoiceTaxItem->id, $request->validated());
        return new CompanyInvoiceTaxItemResource($updated);
    }

    public function destroy(CompanyInvoiceTaxItem $companyInvoiceTaxItem)
    {
        $this->authorize('delete', $companyInvoiceTaxItem);

        $this->service->delete($companyInvoiceTaxItem->id);
        return response()->noContent();
    }
}