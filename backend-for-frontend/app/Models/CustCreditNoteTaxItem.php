<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustCreditNoteTaxItem extends Model
{
    protected $table = 'cust_credit_note_tax_items';

    protected $fillable = [
        'credit_note_id',
        'tax_id',
        'item_name',
        'item_type',
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

    public function tax()
    {
        return $this->belongsTo(Tax::class, 'tax_id');
    }
}