<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\HasLogicalDeletion;

class OrderItem extends Model
{
    use HasLogicalDeletion;
    protected $table = 'order_items';

    protected $fillable = [
        'order_id',
        'item_name',
        'item_description',
        'order_amount',
        'quantity',
        'total',
        'custom_note',
        'is_taxable',
        'tax_id',
        'tax_item_name',
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

    protected static function booted(): void
    {
        static::saving(function (OrderItem $item) {
            $quantity = $item->quantity ?? 1;
            $amount = $item->order_amount ?? 0;
            $item->total = $amount * $quantity;

            $isTaxable = (bool) ($item->is_taxable ?? false);

            if (! $isTaxable) {
                $item->item_amount = 0;
                return;
            }

            $baseAmount = $item->total ?? 0;
            $value = $item->item_value !== null ? (float) $item->item_value : 0.0;

            if ($item->item_type === 'fixed') {
                $item->item_amount = $value;
            } elseif ($item->item_type === 'percent') {
                $item->item_amount = $baseAmount * ($value / 100);
            }
        });
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

}