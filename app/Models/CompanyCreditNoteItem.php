<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyCreditNoteItem extends Model
{
    protected $table = 'company_credit_note_items';

    public $timestamps = false;

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
    ];

    public function creditNote()
    {
        return $this->belongsTo(CompanyCreditNote::class, 'credit_note_id');
    }
}