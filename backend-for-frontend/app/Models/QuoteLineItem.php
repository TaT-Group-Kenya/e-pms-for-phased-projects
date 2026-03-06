<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\HasLogicalDeletion;

class QuoteLineItem extends Model
{
    use HasLogicalDeletion;
    protected $table = 'quote_line_items';

    protected $fillable = [
        'quotation_id',
        'item_name',
        'description',
        'quoted_amount',
        'quantity',
        'total',
        'estimated_hours',
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
        static::saving(function (QuoteLineItem $item) {
            $quantity = $item->quantity ?? 1;
            $amount = $item->quoted_amount ?? 0;
            $item->total = $amount * $quantity;

            // Derive tax amount per line when taxable
            if (! $item->is_taxable) {
                $item->item_amount = 0;
                return;
            }

            $baseAmount = $item->total ?? ($amount * $quantity);
            $value = $item->item_value !== null ? (float) $item->item_value : 0.0;

            if ($item->item_type === 'fixed') {
                $item->item_amount = $value;
            } elseif ($item->item_type === 'percent') {
                $item->item_amount = $baseAmount * ($value / 100);
            }
        });
    }

    public function quotation()
    {
        return $this->belongsTo(Quotation::class, 'quotation_id');
    }

}