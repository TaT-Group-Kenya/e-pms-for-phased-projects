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
        'project_phase_id',
        'phase_name',
        'phase_description',
        'quoted_amount',
        'quantity',
        'total',
        'estimated_hours',
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
        static::saving(function (QuoteLineItem $item) {
            $quantity = $item->quantity ?? 1;
            $amount = $item->quoted_amount ?? 0;
            $item->total = $amount * $quantity;
        });
    }

    public function quotation()
    {
        return $this->belongsTo(Quotation::class, 'quotation_id');
    }

    public function projectPhase()
    {
        return $this->belongsTo(ProjectPhase::class, 'project_phase_id');
    }
}