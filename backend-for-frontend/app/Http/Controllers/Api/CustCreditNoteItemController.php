<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CustCreditNoteItem;
use App\Services\CustCreditNoteItemService;
use App\Http\Resources\CustCreditNoteItemResource;
use App\Http\Requests\CustCreditNoteItemStoreRequest;
use App\Http\Requests\CustCreditNoteItemUpdateRequest;

class CustCreditNoteItemController extends Controller
{
    protected $service;

    public function __construct(CustCreditNoteItemService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\CustCreditNoteItem::class);
        $perPage = (int) ($request->get('per_page', 15));
        $data = $this->service->index($request->all(), $perPage);
        return CustCreditNoteItemResource::collection($data);
    }

    public function store(CustCreditNoteItemStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
        return new CustCreditNoteItemResource($model);
    }

    public function show(CustCreditNoteItem $custCreditNoteItem)
    {
        $this->authorize('view', $custCreditNoteItem);

        return new CustCreditNoteItemResource($custCreditNoteItem);
    }

    public function update(CustCreditNoteItemUpdateRequest $request, CustCreditNoteItem $custCreditNoteItem)
    {
        $this->authorize('update', $custCreditNoteItem);

        $updated = $this->service->update($custCreditNoteItem->id, $request->validated());
        return new CustCreditNoteItemResource($updated);
    }

    public function destroy(CustCreditNoteItem $custCreditNoteItem)
    {
        $this->authorize('delete', $custCreditNoteItem);

        $this->service->delete($custCreditNoteItem->id);
        return response()->noContent();
    }
}