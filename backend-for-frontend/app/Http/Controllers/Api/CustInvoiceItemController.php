<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CustInvoiceItem;
use App\Services\CustInvoiceItemService;
use App\Http\Resources\CustInvoiceItemResource;
use App\Http\Requests\CustInvoiceItemStoreRequest;
use App\Http\Requests\CustInvoiceItemUpdateRequest;
use Illuminate\Support\Facades\Auth;

class CustInvoiceItemController extends Controller
{
    protected $service;

    public function __construct(CustInvoiceItemService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\CustInvoiceItem::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return CustInvoiceItemResource::collection($data);
    }

    public function store(CustInvoiceItemStoreRequest $request)
    {
        $this->authorize('create', \App\Models\CustInvoiceItem::class);
        $validated = $request->validated();
        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);
        return new CustInvoiceItemResource($model);
    }

    public function show(CustInvoiceItem $custInvoiceItem)
    {
        $this->authorize('view', $custInvoiceItem);

        return new CustInvoiceItemResource($custInvoiceItem);
    }

    public function update(CustInvoiceItemUpdateRequest $request, CustInvoiceItem $custInvoiceItem)
    {
        $this->authorize('update', $custInvoiceItem);

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($custInvoiceItem->id, $validated);
        return new CustInvoiceItemResource($updated);
    }

    public function destroy(CustInvoiceItem $custInvoiceItem)
    {
        $this->authorize('delete', $custInvoiceItem);

        $this->service->delete($custInvoiceItem->id);
        return response()->noContent();
    }
}