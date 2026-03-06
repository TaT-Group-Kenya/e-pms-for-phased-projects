<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\OrderItem;
use App\Models\Order;
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
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return OrderItemResource::collection($data);
    }

    public function store(OrderItemStoreRequest $request)
    {
        $this->authorize('create', \App\Models\OrderItem::class);
        
        $validated = $request->validated();

        if (!empty($validated['order_id'])) {
            $order = Order::findOrFail($validated['order_id']);
            if ($order->status === 'approved') {
                return response()->json([
                    'message' => 'Items cannot be added to an approved order. Unapprove the order first.',
                    'errors'  => [
                        'order_id' => ['This order is approved and locked for changes.'],
                    ],
                ], 422);
            }
        }
        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);

        if (!empty($model->order_id)) {
            $this->recalculateOrderTotals($model->order_id);
        }

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

        $order = $orderItem->order ?: Order::find($orderItem->order_id);
        if ($order && $order->status === 'approved') {
            return response()->json([
                'message' => 'Items on an approved order cannot be edited. Unapprove the order first.',
                'errors'  => [
                    'order_id' => ['This order is approved and locked for changes.'],
                ],
            ], 422);
        }

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($orderItem->id, $validated);

        if (!empty($updated->order_id)) {
            $this->recalculateOrderTotals($updated->order_id);
        }

        return new OrderItemResource($updated);
    }

    public function destroy(OrderItem $orderItem)
    {
        $this->authorize('delete', $orderItem);

        $order = $orderItem->order ?: Order::find($orderItem->order_id);
        if ($order && $order->status === 'approved') {
            return response()->json([
                'message' => 'Items on an approved order cannot be deleted. Unapprove the order first.',
                'errors'  => [
                    'order_id' => ['This order is approved and locked for changes.'],
                ],
            ], 422);
        }

        $orderId = $orderItem->order_id;

        $this->service->delete($orderItem->id);

        if (!empty($orderId)) {
            $this->recalculateOrderTotals($orderId);
        }
        return response()->noContent();
    }

    protected function recalculateOrderTotals(int $orderId): void
    {
        $order = Order::with('orderItems')->find($orderId);
        if (! $order) {
            return;
        }

        $subtotal = $order->orderItems->sum(function (OrderItem $item) {
            return (float) ($item->total ?? 0);
        });

        $lineTaxAmount = $order->orderItems->sum(function (OrderItem $item) {
            return (float) ($item->item_amount ?? 0);
        });

        $discountPercentage = (float) ($order->discount_percentage ?? 0);
        $discountAmount = $subtotal * ($discountPercentage / 100);
        $taxAmount = $lineTaxAmount;
        $totalAmount = $subtotal + $taxAmount - $discountAmount;

        $order->subtotal_amount = $subtotal;
        $order->tax_amount = $taxAmount;
        $order->discount_amount = $discountAmount;
        $order->total_amount = $totalAmount;

        $order->save();
    }
}