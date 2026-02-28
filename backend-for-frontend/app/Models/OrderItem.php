<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $table = 'order_items';

    protected $fillable = [
        'order_id',
        'project_phase_id',
        'item_name',
        'item_description',
        'order_amount',
        'quantity',
        'total',
        'custom_note',
        'is_taxable',
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
        });
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function projectPhase()
    {
        return $this->belongsTo(ProjectPhase::class);
    }
}