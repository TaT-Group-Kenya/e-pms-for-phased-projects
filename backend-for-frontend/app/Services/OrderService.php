<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Quotation;
use App\Models\OrderItem;
use App\Services\CommonService;

class OrderService
{
    public function index(
        array $filters = [],
        int $perPage = 15,
        int $page = 1,
        int $offset = 0,
        array $with = []
    ) {
        // optimized query: apply eager loading and simple filters
        $query = Order::query();
        if (!empty($with)) {
            $query->with($with);
        }
        foreach ($filters as $key => $value) {
            $query->where($key, $value);
        }
        
        // Calculate offset if page is provided, otherwise use explicit offset
        $calculatedOffset = $page > 1 ? ($page - 1) * $perPage + $offset : $offset;
        
        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    public function find(int $id, array $with = [])
    {
        $query = Order::query();
        if (!empty($with)) $query->with($with);
        return $query->findOrFail($id);
    }

    public function create(array $data)
    {
        return Order::create($data);
    }

    public function update(int $id, array $data)
    {
        $model = Order::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete(int $id, ?int $deletedBy = null)
    {
        $model = Order::findOrFail($id);

        return $model->softDelete($deletedBy);
    }

    /**
     * Create an order (header + items + tax items) by copying
     * financial details from a quotation. Non-financial fields
     * such as title, description, payment_terms and notes_to_customer
     * can be overridden via the $overrides array.
     */
    public function createFromQuotation(Quotation $quotation, array $overrides = [], ?int $userId = null): Order
    {
        $commonService = new CommonService();
        do {
            $orderNumber = $commonService->generateUniqueCode('ORD-');
        } while (Order::where('order_number', $orderNumber)->exists());

        $data = [
            'order_number'        => $orderNumber,
            'quotation_id'        => $quotation->id,
            // Project will be created later when the order is approved
            'project_id'          => null,
            'customer_id'         => $overrides['customer_id'] ?? $quotation->customer_id,
            'title'               => $overrides['title'] ?? $quotation->title,
            'description'         => $overrides['description'] ?? $quotation->description,
            'status'              => $overrides['status'] ?? 'sent',
            'subtotal_amount'     => $quotation->subtotal_amount,
            'tax_amount'          => $quotation->tax_amount,
            'discount_percentage' => $quotation->discount_percentage,
            'discount_amount'     => $quotation->discount_amount,
            'total_amount'        => $quotation->total_amount,
            'currency'            => $quotation->currency,
            'job_reference_id'    => $quotation->job_reference_id,
            'payment_terms'       => $overrides['payment_terms'] ?? $quotation->payment_terms,
            'notes_to_customer'   => $overrides['notes_to_customer'] ?? $quotation->notes_to_customer,
            'created_by'          => $userId,
            'updated_by'          => $userId,
        ];

        $order = Order::create($data);

        foreach ($quotation->quoteItems as $item) {
            OrderItem::create([
                'order_id'         => $order->id,
                'item_name'        => $item->item_name,
                'item_description' => $item->description,
                'order_amount'     => $item->quoted_amount,
                'quantity'         => $item->quantity ?? 1,
                'custom_note'      => $item->custom_note,
                'is_taxable'       => (bool) $item->is_taxable,
                'tax_id'           => $item->tax_id,
                'tax_item_name'    => $item->tax_item_name,
                'item_type'        => $item->item_type,
                'item_value'       => $item->item_value,
                'item_amount'      => $item->item_amount,
                'created_by'       => $userId,
                'updated_by'       => $userId,
            ]);
        }

        $order->load(['orderItems', 'project', 'customer', 'quotation']);

        return $order;
    }
}