<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderTaxItem extends Model
{
    protected $table = 'order_tax_items';

    protected $fillable = [
        'order_id',
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

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function tax()
    {
        return $this->belongsTo(Tax::class, 'tax_id');
    }

    protected static function booted()
    {
        // Before saving, calculate the tax item amount based on type and
        // the sum of order items for the related order.
        static::saving(function (OrderTaxItem $taxItem) {
            if (!$taxItem->order_id) {
                return;
            }

            $order = $taxItem->order()->with('orderItems')->first();
            if (!$order) {
                return;
            }

            $baseAmount = $order->orderItems()->sum('total');
            $value = $taxItem->item_value !== null ? (float) $taxItem->item_value : 0.0;

            if ($taxItem->item_type === 'fixed') {
                $taxItem->item_amount = $value;
            } elseif ($taxItem->item_type === 'percent') {
                $taxItem->item_amount = $baseAmount * ($value / 100);
            }
        });

        $recalculateOrderTotals = function (OrderTaxItem $taxItem) {
            if (!$taxItem->order_id) {
                return;
            }

            $order = $taxItem->order()->with('taxitems')->first();
            if (!$order) {
                return;
            }

            $taxAmount = $order->taxitems()->sum('item_amount');
            $order->tax_amount = $taxAmount;

            $subtotal = $order->subtotal_amount ?? 0;
            $discount = $order->discount_amount ?? 0;
            $order->total_amount = $subtotal - $discount + $taxAmount;

            $order->save();
        };

        static::saved($recalculateOrderTotals);
        static::deleted($recalculateOrderTotals);
    }

    public function getItemTypeNameAttribute()
    {
        $types = [
            'vat' => 'VAT',
            'service_tax' => 'Service Tax',
            'sales_tax' => 'Sales Tax',
            'wht' => 'Withholding Tax',
        ];

        return $types[$this->item_type] ?? 'Unknown';
    }

    
    public function getItemTypes()
    {
        return [
            'vat' => 'VAT',
            'service_tax' => 'Service Tax',
            'sales_tax' => 'Sales Tax',
            'wht' => 'Withholding Tax',
        ];

    }
}