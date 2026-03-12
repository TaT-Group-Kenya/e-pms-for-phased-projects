<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\HasLogicalDeletion;

class CustCreditNoteItem extends Model
{
    use HasLogicalDeletion;

    protected $table = 'cust_credit_note_items';

    protected $fillable = [
        'credit_note_id',
        'item_name',
        'item_description',
        'item_amount',
        'quantity',
        'total',
        'is_taxable',
        'tax_id',
        'tax_item_name',
        'item_type',
        'item_value',
        'tax_amount',
        'custom_note',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    public function creditNote()
    {
        return $this->belongsTo(CustCreditNote::class, 'credit_note_id');
    }

    protected static function booted(): void
    {
        static::saving(function (CustCreditNoteItem $item) {
            $quantity = $item->quantity ?? 1;
            $amount = $item->item_amount ?? 0;
            $item->total = $amount * $quantity;

            $isTaxable = (bool) ($item->is_taxable ?? false);

            if (! $isTaxable) {
                $item->tax_amount = 0;
                return;
            }

            $baseAmount = $item->total ?? 0;
            $value = $item->item_value !== null ? (float) $item->item_value : 0.0;

            if ($item->item_type === 'fixed') {
                $item->tax_amount = $value;
            } elseif ($item->item_type === 'percent') {
                $item->tax_amount = $baseAmount * ($value / 100);
            }
        });

        $recalculateTotals = function (CustCreditNoteItem $item) {
            if (! $item->credit_note_id) {
                return;
            }

            $note = $item->creditNote()->with('items')->first();
            if (! $note) {
                return;
            }

            $subtotal = $note->items->sum(function (CustCreditNoteItem $line) {
                return (float) ($line->total ?? 0);
            });

            $taxAmount = $note->items->sum(function (CustCreditNoteItem $line) {
                return (float) ($line->tax_amount ?? 0);
            });

            $note->subtotal_amount = $subtotal;
            $note->tax_amount = $taxAmount;
            $note->total_amount = $subtotal + $taxAmount;

            $note->save();
        };

        static::saved($recalculateTotals);
        static::deleted($recalculateTotals);
    }
}