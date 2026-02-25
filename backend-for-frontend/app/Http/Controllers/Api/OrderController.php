<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Quotation;
use App\Models\QuoteLineItem;
use App\Models\OrderItem;
use App\Services\CommonService;
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

    /**
     * Generate an order from an approved quotation.
     */
    public function generateFromQuotation(Request $request)
    {
        $request->validate([
            'quotation_id' => ['required', 'integer', 'exists:quotations,id'],
        ]);

        $quotation = Quotation::with(['quoteItems', 'order'])->findOrFail($request->input('quotation_id'));

        // Only allow generation from approved quotations without an existing order
        if ($quotation->status !== 'approved') {
            return response()->json([
                'message' => 'Order can only be generated from approved quotations.',
                'errors' => [
                    'status' => ['Quotation must be approved before generating an order.'],
                ],
            ], 422);
        }

        if ($quotation->order) {
            return response()->json([
                'message' => 'An order already exists for this quotation.',
                'errors' => [
                    'quotation_id' => ['Only one order is allowed per quotation.'],
                ],
            ], 422);
        }

        $commonService = new CommonService();
        do {
            $orderNumber = $commonService->generateUniqueCode('ORD-');
        } while (Order::where('order_number', $orderNumber)->exists());

        // Create order from quotation header
        $order = Order::create([
            'order_number'      => $orderNumber,
            'quotation_id'      => $quotation->id,
            'project_id'        => $quotation->project_id,
            'customer_id'       => $quotation->customer_id,
            'title'             => $quotation->title,
            'description'       => $quotation->description,
            'status'            => 'draft',
            'subtotal_amount'   => $quotation->subtotal_amount,
            'tax_percentage'    => $quotation->tax_percentage,
            'tax_amount'        => $quotation->tax_amount,
            'discount_percentage' => $quotation->discount_percentage,
            'discount_amount'   => $quotation->discount_amount,
            'total_amount'      => $quotation->total_amount,
            'currency'          => $quotation->currency,
            'payment_terms'     => $quotation->payment_terms,
            'notes_to_customer' => $quotation->notes_to_customer,
            'created_by'        => $request->user()?->id,
            'updated_by'        => $request->user()?->id,
        ]);

        // Create order items from quote line items
        foreach ($quotation->quoteItems as $item) {
            OrderItem::create([
                'order_id'         => $order->id,
                'project_phase_id' => $item->project_phase_id,
                'item_name'        => $item->phase_name,
                'item_description' => $item->phase_description,
                'order_amount'     => $item->quoted_amount,
                'quantity'         => $item->quantity ?? 1,
                'custom_note'      => $item->custom_note,
                'is_taxable'       => (bool) $item->is_taxable,
                'created_by'       => $request->user()?->id,
                'updated_by'       => $request->user()?->id,
            ]);
        }

        // Reload with relationships for response
        $order->load(['orderItems', 'project', 'customer', 'quotation']);

        return new OrderResource($order);
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

        // Prevent deleting orders that have customer invoices
        if ($order->custInvoices()->exists()) {
            return response()->json([
                'message' => 'Order cannot be deleted because it has linked customer invoices.',
                'errors' => [
                    'order' => ['Delete any related customer invoices before deleting the order.'],
                ],
            ], 422);
        }

        // Delete order items and related records, then the order itself
        $order->orderItems()->delete();
        $order->taxitems()->delete();
        $order->documents()->delete();

        $this->service->delete($order->id);
        return response()->noContent();
    }
}