<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\HasLogicalDeletion;

class CustInvoiceItem extends Model
{
    use HasLogicalDeletion;
    protected $table = 'cust_invoice_items';

    protected $fillable = [
        'invoice_id',
        'project_phase_id',
        'item_name',
        'item_description',
        'item_amount',
        'quantity',
        'total',
        'is_taxable',
        'custom_note',
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
        static::saving(function (CustInvoiceItem $item) {
            $quantity = $item->quantity ?? 1;
            $amount = $item->item_amount ?? 0;
            $item->total = $amount * $quantity;
        });
    }

    public function invoice()
    {
        return $this->belongsTo(CustInvoice::class, 'invoice_id');
    }

    public function projectPhase()
    {
        return $this->belongsTo(ProjectPhase::class, 'project_phase_id');
    }
}