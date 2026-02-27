<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyCreditNoteTaxItem extends Model
{
    protected $table = 'company_credit_note_tax_items';

    public $timestamps = false;

    protected $fillable = [
        'credit_note_id',
        'tax_id',
        'item_name',
        'item_type',
        'item_value',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
    ];

    public function creditNote()
    {
        return $this->belongsTo(CompanyCreditNote::class, 'credit_note_id');
    }

    public function tax()
    {
        return $this->belongsTo(Tax::class, 'tax_id');
    }
}