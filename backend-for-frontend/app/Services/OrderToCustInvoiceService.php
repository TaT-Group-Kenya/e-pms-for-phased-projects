<?php

namespace App\Services;

use App\Models\Order;
use App\Models\CustInvoice;
use App\Models\CustInvoiceItem;
use App\Models\CustInvoiceTaxItem;
use App\Services\CommonService;

class OrderToCustInvoiceService
{
    /**
     * Create a draft customer invoice (with items & tax items) from the given order.
     */
    public function createInvoiceFromOrder(Order $order, ?int $userId = null, array $overrides = []): CustInvoice
    {
        $commonService = new CommonService();

        do {
            $invoiceNumber = $commonService->generateUniqueCode('CINV-');
        } while (CustInvoice::where('invoice_number', $invoiceNumber)->exists());

        $invoice = CustInvoice::create([
            'invoice_number'      => $invoiceNumber,
            'order_id'            => $order->id,
            'project_id'          => $order->project_id,
            'customer_id'         => $order->customer_id,
            'title'               => $overrides['title'] ?? $order->title,
            'description'         => $overrides['description'] ?? $order->description,
            'status'              => 'draft',
            'subtotal_amount'     => $order->subtotal_amount,
            'tax_amount'          => $order->tax_amount,
            'discount_percentage' => $order->discount_percentage,
            'discount_amount'     => $order->discount_amount,
            'total_amount'        => $order->total_amount,
            'currency'            => $order->currency,
            'payment_terms'       => $overrides['payment_terms'] ?? $order->payment_terms,
            'notes_to_customer'   => $overrides['notes_to_customer'] ?? $order->notes_to_customer,
            'valid_until'         => now()->addDays(30),
            'created_by'          => $userId,
            'updated_by'          => $userId,
        ]);

        // Ensure related data is loaded
        $order->loadMissing(['orderItems', 'taxitems']);

        foreach ($order->orderItems as $item) {
            CustInvoiceItem::create([
                'invoice_id'        => $invoice->id,
                'project_phase_id'  => $item->project_phase_id,
                'item_name'         => $item->item_name,
                'item_description'  => $item->item_description,
                'item_amount'       => $item->order_amount,
                'quantity'          => $item->quantity ?? 1,
                'custom_note'       => $item->custom_note,
                'is_taxable'        => (bool) $item->is_taxable,
                'created_by'        => $userId,
                'updated_by'        => $userId,
            ]);
        }

        foreach ($order->taxitems as $taxItem) {
            CustInvoiceTaxItem::create([
                'invoice_id'   => $invoice->id,
                'tax_id'       => $taxItem->tax_id,
                'item_name'    => $taxItem->item_name,
                'item_type'    => $taxItem->item_type,
                'item_value'   => $taxItem->item_value,
                'item_amount'  => $taxItem->item_amount,
                'created_by'   => $userId,
                'updated_by'   => $userId,
            ]);
        }

        return $invoice;
    }
}
