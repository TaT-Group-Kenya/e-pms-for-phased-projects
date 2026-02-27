<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\OrderTaxItem;
use App\Models\Tax;
use App\Models\Order;
use App\Services\OrderTaxItemService;
use App\Http\Resources\OrderTaxItemResource;
use App\Http\Requests\OrderTaxItemStoreRequest;
use App\Http\Requests\OrderTaxItemUpdateRequest;

class OrderTaxItemController extends Controller
{
    protected $service;

    public function __construct(OrderTaxItemService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', OrderTaxItem::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return OrderTaxItemResource::collection($data);
    }

    public function store(OrderTaxItemStoreRequest $request)
    {
        $this->authorize('create', OrderTaxItem::class);
        $validated = $request->validated();
        $orderId = $validated['order_id'] ?? null;

        if ($orderId) {
            $order = Order::findOrFail($orderId);
            if ($order->status === 'approved') {
                return response()->json([
                    'message' => 'Tax items cannot be added to an approved order. Unapprove the order first.',
                    'errors'  => [
                        'order_id' => ['This order is approved and locked for changes.'],
                    ],
                ], 422);
            }
        }
        $taxId = $validated['tax_id'] ?? null;

        if ($taxId) {
            $tax = Tax::findOrFail($taxId);
            $validated['item_name'] = $tax->name;
        }

        // Enforce unique tax per order: no duplicate tax (by tax_id) on the same order
        if (!empty($validated['order_id']) && !empty($taxId)) {
            $exists = OrderTaxItem::where('order_id', $validated['order_id'])
                ->where('tax_id', $taxId)
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'This tax has already been added to the order.',
                    'errors' => [
                        'tax_id' => ['A tax item with this tax has already been added to this order.'],
                    ],
                ], 422);
            }
        }

        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);
        return new OrderTaxItemResource($model);
    }

    public function show(OrderTaxItem $OrderTaxItem)
    {
        $this->authorize('view', $OrderTaxItem);

        return new OrderTaxItemResource($OrderTaxItem);
    }

    public function update(OrderTaxItemUpdateRequest $request, OrderTaxItem $OrderTaxItem)
    {
        $this->authorize('update', $OrderTaxItem);

        $parentOrder = $OrderTaxItem->order ?: Order::find($OrderTaxItem->order_id);
        if ($parentOrder && $parentOrder->status === 'approved') {
            return response()->json([
                'message' => 'Tax items on an approved order cannot be edited. Unapprove the order first.',
                'errors'  => [
                    'order_id' => ['This order is approved and locked for changes.'],
                ],
            ], 422);
        }

        $validated = $request->validated();
        $taxId = array_key_exists('tax_id', $validated)
            ? $validated['tax_id']
            : $OrderTaxItem->tax_id;

        if (!empty($validated['tax_id'])) {
            $tax = Tax::findOrFail($validated['tax_id']);
            $validated['item_name'] = $tax->name;
        }

        // Enforce unique tax per order on update as well (by tax_id)
        $orderId = $validated['order_id'] ?? $OrderTaxItem->order_id;

        if (!empty($orderId) && !empty($taxId)) {
            $exists = OrderTaxItem::where('order_id', $orderId)
                ->where('tax_id', $taxId)
                ->where('id', '!=', $OrderTaxItem->id)
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'This tax has already been added to the order.',
                    'errors' => [
                        'tax_id' => ['A tax item with this tax has already been added to this order.'],
                    ],
                ], 422);
            }
        }

        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($OrderTaxItem->id, $validated);
        return new OrderTaxItemResource($updated);
    }

    public function destroy(OrderTaxItem $OrderTaxItem)
    {
        $this->authorize('delete', $OrderTaxItem);

        $parentOrder = $OrderTaxItem->order ?: Order::find($OrderTaxItem->order_id);
        if ($parentOrder && $parentOrder->status === 'approved') {
            return response()->json([
                'message' => 'Tax items on an approved order cannot be deleted. Unapprove the order first.',
                'errors'  => [
                    'order_id' => ['This order is approved and locked for changes.'],
                ],
            ], 422);
        }

        $this->service->delete($OrderTaxItem->id);
        return response()->noContent();
    }
}