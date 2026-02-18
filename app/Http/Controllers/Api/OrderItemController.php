<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OrderItem;
use App\Services\OrderItemService;
use App\Http\Resources\OrderItemResource;
use App\Http\Requests\OrderItemStoreRequest;
use App\Http\Requests\OrderItemUpdateRequest;

class OrderItemController extends Controller
{
    protected $service;

    public function __construct(OrderItemService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\OrderItem::class);
        $perPage = (int) ($request->get('per_page', 15));
        $data = $this->service->index($request->all(), $perPage);
        return OrderItemResource::collection($data);
    }

    public function store(OrderItemStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
        return new OrderItemResource($model);
    }

    public function show(OrderItem $orderItem)
    {
        $this->authorize('view', $orderItem);

        return new OrderItemResource($orderItem);
    }

    public function update(OrderItemUpdateRequest $request, OrderItem $orderItem)
    {
        $this->authorize('update', $orderItem);

        $updated = $this->service->update($orderItem->id, $request->validated());
        return new OrderItemResource($updated);
    }

    public function destroy(OrderItem $orderItem)
    {
        $this->authorize('delete', $orderItem);

        $this->service->delete($orderItem->id);
        return response()->noContent();
    }
}