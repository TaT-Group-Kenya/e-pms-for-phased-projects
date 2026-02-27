<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuotationTaxItem extends Model
{
    protected $table = 'quotation_tax_items';

    protected $fillable = [
        'quotation_id',
        'tax_id',
        'item_name',
        'item_type',
        'item_value',
        'item_amount',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
    ];

    public function quotation()
    {
        return $this->belongsTo(Quotation::class, 'quotation_id');
    }

    public function tax()
    {
        return $this->belongsTo(Tax::class, 'tax_id');
    }

    protected static function booted()
    {
        // Before saving, calculate the tax item amount based on type and
        // the sum of quote line items for the related quotation.
        static::saving(function (QuotationTaxItem $taxItem) {
            if (!$taxItem->quotation_id) {
                return;
            }

            $quotation = $taxItem->quotation()->with('quoteItems')->first();
            if (!$quotation) {
                return;
            }

            $baseAmount = $quotation->quoteItems()->sum('total');
            $value = $taxItem->item_value !== null ? (float) $taxItem->item_value : 0.0;

            if ($taxItem->item_type === 'fixed') {
                $taxItem->item_amount = $value;
            } elseif ($taxItem->item_type === 'percent') {
                $taxItem->item_amount = $baseAmount * ($value / 100);
            }
        });

        $recalculateQuotationTotals = function (QuotationTaxItem $taxItem) {
            if (!$taxItem->quotation_id) {
                return;
            }

            $quotation = $taxItem->quotation()->with(['taxitems', 'quoteItems'])->first();
            if (!$quotation) {
                return;
            }

            $taxAmount = $quotation->taxitems()->sum('item_amount');
            $subtotal = $quotation->quoteItems()->sum('total');
            $discountPercentage = (float) ($quotation->discount_percentage ?? 0);
            $discountAmount = $subtotal * ($discountPercentage / 100);
            $totalAmount = $subtotal + $taxAmount - $discountAmount;

            $quotation->subtotal_amount = $subtotal;
            $quotation->tax_amount = $taxAmount;
            $quotation->discount_amount = $discountAmount;
            $quotation->total_amount = $totalAmount;

            $quotation->save();
        };

        static::saved($recalculateQuotationTotals);
        static::deleted($recalculateQuotationTotals);
    }
}
