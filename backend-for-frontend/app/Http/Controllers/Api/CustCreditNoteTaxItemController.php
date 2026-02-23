<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\CustCreditNoteTaxItem;
use App\Services\CustCreditNoteTaxItemService;
use App\Http\Resources\CustCreditNoteTaxItemResource;
use App\Http\Requests\CustCreditNoteTaxItemStoreRequest;
use App\Http\Requests\CustCreditNoteTaxItemUpdateRequest;

class CustCreditNoteTaxItemController extends Controller
{
    protected $service;

    public function __construct(CustCreditNoteTaxItemService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\CustCreditNoteTaxItem::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return CustCreditNoteTaxItemResource::collection($data);
    }

    public function store(CustCreditNoteTaxItemStoreRequest $request)
    {
        $validated = $request->validated();
        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);
        return new CustCreditNoteTaxItemResource($model);
    }

    public function show(CustCreditNoteTaxItem $custCreditNoteTaxItem)
    {
        $this->authorize('view', $custCreditNoteTaxItem);

        return new CustCreditNoteTaxItemResource($custCreditNoteTaxItem);
    }

    public function update(CustCreditNoteTaxItemUpdateRequest $request, CustCreditNoteTaxItem $custCreditNoteTaxItem)
    {
        $this->authorize('update', $custCreditNoteTaxItem);

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($custCreditNoteTaxItem->id, $validated);
        return new CustCreditNoteTaxItemResource($updated);
    }

    public function destroy(CustCreditNoteTaxItem $custCreditNoteTaxItem)
    {
        $this->authorize('delete', $custCreditNoteTaxItem);

        $this->service->delete($custCreditNoteTaxItem->id);
        return response()->noContent();
    }
}