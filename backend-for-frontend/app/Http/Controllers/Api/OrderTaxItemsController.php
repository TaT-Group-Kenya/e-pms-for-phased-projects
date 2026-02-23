<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\OrderTaxItems;
use App\Services\OrderTaxItemsService;
use App\Http\Resources\OrderTaxItemsResource;
use App\Http\Requests\OrderTaxItemsStoreRequest;
use App\Http\Requests\OrderTaxItemsUpdateRequest;

class OrderTaxItemsController extends Controller
{
    protected $service;

    public function __construct(OrderTaxItemsService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\OrderTaxItems::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return OrderTaxItemsResource::collection($data);
    }

    public function store(OrderTaxItemsStoreRequest $request)
    {
        $validated = $request->validated();
        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);
        return new OrderTaxItemsResource($model);
    }

    public function show(OrderTaxItems $orderTaxItems)
    {
        $this->authorize('view', $orderTaxItems);

        return new OrderTaxItemsResource($orderTaxItems);
    }

    public function update(OrderTaxItemsUpdateRequest $request, OrderTaxItems $orderTaxItems)
    {
        $this->authorize('update', $orderTaxItems);

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($orderTaxItems->id, $validated);
        return new OrderTaxItemsResource($updated);
    }

    public function destroy(OrderTaxItems $orderTaxItems)
    {
        $this->authorize('delete', $orderTaxItems);

        $this->service->delete($orderTaxItems->id);
        return response()->noContent();
    }
}