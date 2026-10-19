<?php

namespace App\Models;

use App\Models\Traits\HasLogicalDeletion;
use Illuminate\Database\Eloquent\Model;

class CustDebitNoteItem extends Model
{
    use HasLogicalDeletion;

    protected $table = 'cust_debit_note_items';

    protected $fillable = [
        'debit_note_id', 'item_name', 'item_description', 'item_amount',
        'quantity', 'total', 'is_taxable', 'tax_id', 'tax_item_name',
        'item_type', 'item_value', 'tax_amount', 'custom_note',
        'updated_at', 'updated_by', 'created_at', 'created_by',
        'is_deleted', 'deleted_at', 'deleted_by',
    ];

    public function debitNote()
    {
        return $this->belongsTo(CustDebitNote::class, 'debit_note_id');
    }

    protected static function booted(): void
    {
        static::saving(function (CustDebitNoteItem $item) {
            $item->total = (float) ($item->item_amount ?? 0) * (float) ($item->quantity ?? 1);
            if (! (bool) $item->is_taxable) {
                $item->tax_amount = 0;
            } else {
                $value = (float) ($item->item_value ?? 0);
                $item->tax_amount = $item->item_type === 'fixed'
                    ? $value
                    : ($item->item_type === 'percent' ? $item->total * $value / 100 : 0);
            }
        });

        $recalculate = function (CustDebitNoteItem $item) {
            if (! $item->debit_note_id) {
                return;
            }
            $note = CustDebitNote::with('items')->find($item->debit_note_id);
            if (! $note) {
                return;
            }
            $note->subtotal_amount = $note->items->sum('total');
            $note->tax_amount = $note->items->sum('tax_amount');
            $note->total_amount = $note->subtotal_amount + $note->tax_amount;
            $note->save();
        };

        static::saved($recalculate);
        static::deleted($recalculate);
    }
}
