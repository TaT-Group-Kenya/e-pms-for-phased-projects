<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CompanyInvoiceItem;
use App\Services\CompanyInvoiceItemService;
use App\Http\Resources\CompanyInvoiceItemResource;
use App\Http\Requests\CompanyInvoiceItemStoreRequest;
use App\Http\Requests\CompanyInvoiceItemUpdateRequest;

class CompanyInvoiceItemController extends Controller
{
    protected $service;

    public function __construct(CompanyInvoiceItemService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\CompanyInvoiceItem::class);
        $perPage = (int) ($request->get('per_page', 15));
        $data = $this->service->index($request->all(), $perPage);
        return CompanyInvoiceItemResource::collection($data);
    }

    public function store(CompanyInvoiceItemStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
        return new CompanyInvoiceItemResource($model);
    }

    public function show(CompanyInvoiceItem $companyInvoiceItem)
    {
        $this->authorize('view', $companyInvoiceItem);

        return new CompanyInvoiceItemResource($companyInvoiceItem);
    }

    public function update(CompanyInvoiceItemUpdateRequest $request, CompanyInvoiceItem $companyInvoiceItem)
    {
        $this->authorize('update', $companyInvoiceItem);

        $updated = $this->service->update($companyInvoiceItem->id, $request->validated());
        return new CompanyInvoiceItemResource($updated);
    }

    public function destroy(CompanyInvoiceItem $companyInvoiceItem)
    {
        $this->authorize('delete', $companyInvoiceItem);

        $this->service->delete($companyInvoiceItem->id);
        return response()->noContent();
    }
}