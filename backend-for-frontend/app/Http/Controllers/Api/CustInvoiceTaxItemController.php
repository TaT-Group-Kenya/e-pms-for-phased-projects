<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CustInvoiceTaxItem;
use App\Services\CustInvoiceTaxItemService;
use App\Http\Resources\CustInvoiceTaxItemResource;
use App\Http\Requests\CustInvoiceTaxItemStoreRequest;
use App\Http\Requests\CustInvoiceTaxItemUpdateRequest;

class CustInvoiceTaxItemController extends Controller
{
    protected $service;

    public function __construct(CustInvoiceTaxItemService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\CustInvoiceTaxItem::class);
        $perPage = (int) ($request->get('per_page', 15));
        $data = $this->service->index($request->all(), $perPage);
        return CustInvoiceTaxItemResource::collection($data);
    }

    public function store(CustInvoiceTaxItemStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
        return new CustInvoiceTaxItemResource($model);
    }

    public function show(CustInvoiceTaxItem $custInvoiceTaxItem)
    {
        $this->authorize('view', $custInvoiceTaxItem);

        return new CustInvoiceTaxItemResource($custInvoiceTaxItem);
    }

    public function update(CustInvoiceTaxItemUpdateRequest $request, CustInvoiceTaxItem $custInvoiceTaxItem)
    {
        $this->authorize('update', $custInvoiceTaxItem);

        $updated = $this->service->update($custInvoiceTaxItem->id, $request->validated());
        return new CustInvoiceTaxItemResource($updated);
    }

    public function destroy(CustInvoiceTaxItem $custInvoiceTaxItem)
    {
        $this->authorize('delete', $custInvoiceTaxItem);

        $this->service->delete($custInvoiceTaxItem->id);
        return response()->noContent();
    }
}