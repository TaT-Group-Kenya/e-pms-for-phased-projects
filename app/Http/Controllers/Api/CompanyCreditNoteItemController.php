<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CompanyCreditNoteItem;
use App\Services\CompanyCreditNoteItemService;
use App\Http\Resources\CompanyCreditNoteItemResource;
use App\Http\Requests\CompanyCreditNoteItemStoreRequest;
use App\Http\Requests\CompanyCreditNoteItemUpdateRequest;

class CompanyCreditNoteItemController extends Controller
{
    protected $service;

    public function __construct(CompanyCreditNoteItemService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\CompanyCreditNoteItem::class);
        $perPage = (int) ($request->get('per_page', 15));
        $data = $this->service->index($request->all(), $perPage);
        return CompanyCreditNoteItemResource::collection($data);
    }

    public function store(CompanyCreditNoteItemStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
        return new CompanyCreditNoteItemResource($model);
    }

    public function show(CompanyCreditNoteItem $companyCreditNoteItem)
    {
        $this->authorize('view', $companyCreditNoteItem);

        return new CompanyCreditNoteItemResource($companyCreditNoteItem);
    }

    public function update(CompanyCreditNoteItemUpdateRequest $request, CompanyCreditNoteItem $companyCreditNoteItem)
    {
        $this->authorize('update', $companyCreditNoteItem);

        $updated = $this->service->update($companyCreditNoteItem->id, $request->validated());
        return new CompanyCreditNoteItemResource($updated);
    }

    public function destroy(CompanyCreditNoteItem $companyCreditNoteItem)
    {
        $this->authorize('delete', $companyCreditNoteItem);

        $this->service->delete($companyCreditNoteItem->id);
        return response()->noContent();
    }
}