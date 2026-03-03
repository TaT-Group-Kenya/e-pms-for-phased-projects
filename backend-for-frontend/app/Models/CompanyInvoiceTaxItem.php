<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyInvoiceTaxItem extends Model
{
    protected $table = 'company_invoice_tax_items';

    public $timestamps = false;

    protected $fillable = [
        'invoice_id',
        'tax_id',
        'item_name',
        'item_type',
        'item_value',
        'item_amount',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    public function invoice()
    {
        return $this->belongsTo(CompanyInvoice::class, 'invoice_id');
    }

    public function tax()
    {
        return $this->belongsTo(Tax::class, 'tax_id');
    }

    protected static function booted(): void
    {
        // Before saving, calculate the tax item amount based on type and
        // the sum of invoice items for the related company invoice.
        static::saving(function (CompanyInvoiceTaxItem $taxItem) {
            if (!$taxItem->invoice_id) {
                return;
            }

            $invoice = $taxItem->invoice()->with('invoiceItems')->first();
            if (!$invoice) {
                return;
            }

            // For company invoices, each invoice item currently stores its
            // amount in the item_amount column.
            $baseAmount = $invoice->invoiceItems()->sum('item_amount');
            $value = $taxItem->item_value !== null ? (float) $taxItem->item_value : 0.0;

            if ($taxItem->item_type === 'fixed') {
                $taxItem->item_amount = $value;
            } elseif ($taxItem->item_type === 'percent') {
                $taxItem->item_amount = $baseAmount * ($value / 100);
            }
        });

        $recalculateInvoiceTotals = function (CompanyInvoiceTaxItem $taxItem) {
            if (!$taxItem->invoice_id) {
                return;
            }

            $invoice = $taxItem->invoice()->with(['taxitems', 'invoiceItems'])->first();
            if (!$invoice) {
                return;
            }

            $subtotal = $invoice->invoiceItems()->sum('item_amount');
            $taxAmount = $invoice->taxitems()->sum('item_amount');

            $discountPercentage = (float) ($invoice->discount_percentage ?? 0);
            $discountAmount = $subtotal * ($discountPercentage / 100);

            $invoice->subtotal_amount = $subtotal;
            $invoice->tax_amount = $taxAmount;
            $invoice->discount_amount = $discountAmount;
            $invoice->total_amount = $subtotal + $taxAmount - $discountAmount;

            $invoice->save();
        };

        static::saved($recalculateInvoiceTotals);
        static::deleted($recalculateInvoiceTotals);
    }
}