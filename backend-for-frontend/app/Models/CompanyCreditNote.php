<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompanyCreditNote extends Model
{
    protected $table = 'company_credit_notes';

    public $timestamps = false;

    protected $fillable = [
        'credit_note_number',
        'invoice_id',
        'credit_note_date',
        'reason',
        'subtotal_amount',
        'tax_amount',
        'total_amount',
        'currency',
        'exchange_rate',
        'status',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(CompanyInvoice::class, 'invoice_id');
    }

    public function items()
    {
        return $this->hasMany(CompanyCreditNoteItem::class, 'credit_note_id');
    }
}