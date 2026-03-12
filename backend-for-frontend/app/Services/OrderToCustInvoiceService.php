<?php

namespace App\Services;

use App\Models\Order;
use App\Models\CustInvoice;
use App\Models\CustInvoiceItem;
use App\Services\CommonService;

class OrderToCustInvoiceService
{
    /**
     * Create a draft customer invoice (with items) from the given order.
     *
     * Invoice header totals are derived from the created invoice items
     * and the invoice's discount percentage, mirroring quotation/order logic.
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
            'job_reference_id'     => $order->job_reference_id,
            'customer_id'         => $order->customer_id,
            'title'               => $overrides['title'] ?? $order->title,
            'description'         => $overrides['description'] ?? $order->description,
            'status'              => 'sent',
            // Initialize amounts; they will be recalculated from items below
            'subtotal_amount'     => 0,
            'tax_amount'          => 0,
            'discount_percentage' => $order->discount_percentage,
            'discount_amount'     => 0,
            'total_amount'        => 0,
            'currency'            => $order->currency,
            'payment_terms'       => $overrides['payment_terms'] ?? $order->payment_terms,
            'notes_to_customer'   => $overrides['notes_to_customer'] ?? $order->notes_to_customer,
            'valid_until'         => now()->addDays(30),
            'created_by'          => $userId,
            'updated_by'          => $userId,
        ]);

        // Ensure related data is loaded
        $order->loadMissing(['orderItems']);

        foreach ($order->orderItems as $item) {
            CustInvoiceItem::create([
                'invoice_id'        => $invoice->id,
                'item_name'         => $item->item_name,
                'item_description'  => $item->item_description,
                'item_amount'       => $item->order_amount,
                'quantity'          => $item->quantity ?? 1,
                'custom_note'       => $item->custom_note,
                'is_taxable'        => (bool) $item->is_taxable,
                'tax_id'            => $item->tax_id,
                'tax_item_name'     => $item->tax_item_name,
                'item_type'         => $item->item_type,
                'item_value'        => $item->item_value,
                'tax_amount'        => $item->item_amount,
                'created_by'        => $userId,
                'updated_by'        => $userId,
            ]);
        }

        // Recalculate invoice header totals from invoice items and discount
        $invoice->loadMissing('invoiceItems');

        $subtotal = $invoice->invoiceItems->sum(function (CustInvoiceItem $line) {
            return (float) ($line->total ?? 0);
        });

        $taxAmount = $invoice->invoiceItems->sum(function (CustInvoiceItem $line) {
            return (float) ($line->tax_amount ?? 0);
        });

        $discountPercentage = (float) ($invoice->discount_percentage ?? 0);
        $discountAmount = $subtotal * ($discountPercentage / 100);

        $invoice->subtotal_amount = $subtotal;
        $invoice->tax_amount = $taxAmount;
        $invoice->discount_amount = $discountAmount;
        $invoice->total_amount = $subtotal + $taxAmount - $discountAmount;

        $invoice->save();

        return $invoice;
    }
}
