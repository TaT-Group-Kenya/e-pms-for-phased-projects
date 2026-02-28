<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustCreditNoteItem extends Model
{
    protected $table = 'cust_credit_note_items';

    protected $fillable = [
        'credit_note_id',
        'item_name',
        'item_description',
        'item_amount',
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
}