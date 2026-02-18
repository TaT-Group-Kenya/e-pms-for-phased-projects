<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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
        $data = $this->service->index($request->all(), $perPage);
        return CustCreditNoteTaxItemResource::collection($data);
    }

    public function store(CustCreditNoteTaxItemStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
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

        $updated = $this->service->update($custCreditNoteTaxItem->id, $request->validated());
        return new CustCreditNoteTaxItemResource($updated);
    }

    public function destroy(CustCreditNoteTaxItem $custCreditNoteTaxItem)
    {
        $this->authorize('delete', $custCreditNoteTaxItem);

        $this->service->delete($custCreditNoteTaxItem->id);
        return response()->noContent();
    }
}