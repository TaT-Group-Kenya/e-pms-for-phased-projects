<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CompanyCreditNoteTaxItem;
use App\Services\CompanyCreditNoteTaxItemService;
use App\Http\Resources\CompanyCreditNoteTaxItemResource;
use App\Http\Requests\CompanyCreditNoteTaxItemStoreRequest;
use App\Http\Requests\CompanyCreditNoteTaxItemUpdateRequest;

class CompanyCreditNoteTaxItemController extends Controller
{
    protected $service;

    public function __construct(CompanyCreditNoteTaxItemService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\CompanyCreditNoteTaxItem::class);
        $perPage = (int) ($request->get('per_page', 15));
        $data = $this->service->index($request->all(), $perPage);
        return CompanyCreditNoteTaxItemResource::collection($data);
    }

    public function store(CompanyCreditNoteTaxItemStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
        return new CompanyCreditNoteTaxItemResource($model);
    }

    public function show(CompanyCreditNoteTaxItem $companyCreditNoteTaxItem)
    {
        $this->authorize('view', $companyCreditNoteTaxItem);

        return new CompanyCreditNoteTaxItemResource($companyCreditNoteTaxItem);
    }

    public function update(CompanyCreditNoteTaxItemUpdateRequest $request, CompanyCreditNoteTaxItem $companyCreditNoteTaxItem)
    {
        $this->authorize('update', $companyCreditNoteTaxItem);

        $updated = $this->service->update($companyCreditNoteTaxItem->id, $request->validated());
        return new CompanyCreditNoteTaxItemResource($updated);
    }

    public function destroy(CompanyCreditNoteTaxItem $companyCreditNoteTaxItem)
    {
        $this->authorize('delete', $companyCreditNoteTaxItem);

        $this->service->delete($companyCreditNoteTaxItem->id);
        return response()->noContent();
    }
}