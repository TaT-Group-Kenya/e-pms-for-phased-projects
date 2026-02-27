<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\CustInvoiceTaxItem;
use App\Models\Tax;
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
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return CustInvoiceTaxItemResource::collection($data);
    }

    public function store(CustInvoiceTaxItemStoreRequest $request)
    {
        $validated = $request->validated();
        $taxId = $validated['tax_id'] ?? null;
        if ($taxId) {
            $tax = Tax::findOrFail($taxId);
            $validated['item_name'] = $tax->name;
        }
        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);
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

        $validated = $request->validated();
        if (!empty($validated['tax_id'])) {
            $tax = Tax::findOrFail($validated['tax_id']);
            $validated['item_name'] = $tax->name;
        }
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($custInvoiceTaxItem->id, $validated);
        return new CustInvoiceTaxItemResource($updated);
    }

    public function destroy(CustInvoiceTaxItem $custInvoiceTaxItem)
    {
        $this->authorize('delete', $custInvoiceTaxItem);

        $this->service->delete($custInvoiceTaxItem->id);
        return response()->noContent();
    }
}