<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Services\OrderService;
use App\Http\Resources\OrderResource;
use App\Http\Requests\OrderStoreRequest;
use App\Http\Requests\OrderUpdateRequest;

class OrderController extends Controller
{
    protected $service;

    public function __construct(OrderService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\Order::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return OrderResource::collection($data);
    }

    public function store(OrderStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
        return new OrderResource($model);
    }

    public function show(Order $order)
    {
        $this->authorize('view', $order);

        return new OrderResource($order);
    }

    public function update(OrderUpdateRequest $request, Order $order)
    {
        $this->authorize('update', $order);

        $updated = $this->service->update($order->id, $request->validated());
        return new OrderResource($updated);
    }

    public function destroy(Order $order)
    {
        $this->authorize('delete', $order);

        $this->service->delete($order->id);
        return response()->noContent();
    }
}