<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return CustCreditNoteItemResource::collection($data);
    }

    public function store(CustCreditNoteItemStoreRequest $request)
    {
        $validated = $request->validated();
        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);
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

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($custCreditNoteItem->id, $validated);
        return new CustCreditNoteItemResource($updated);
    }

    public function destroy(CustCreditNoteItem $custCreditNoteItem)
    {
        $this->authorize('delete', $custCreditNoteItem);

        $this->service->delete($custCreditNoteItem->id);
        return response()->noContent();
    }
}