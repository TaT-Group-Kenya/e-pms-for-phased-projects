<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return CompanyCreditNoteItemResource::collection($data);
    }

    public function store(CompanyCreditNoteItemStoreRequest $request)
    {
        $validated = $request->validated();
        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);
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

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($companyCreditNoteItem->id, $validated);
        return new CompanyCreditNoteItemResource($updated);
    }

    public function destroy(CompanyCreditNoteItem $companyCreditNoteItem)
    {
        $this->authorize('delete', $companyCreditNoteItem);

        $this->service->delete($companyCreditNoteItem->id);
        return response()->noContent();
    }
}