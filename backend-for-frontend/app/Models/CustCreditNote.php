<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\HasLogicalDeletion;

class CustCreditNote extends Model
{
    use HasLogicalDeletion;

    protected $table = 'cust_credit_notes';

    protected $fillable = [
        'credit_note_number',
        'invoice_id',
        'title',
        'description',
        'status',
        'subtotal_amount',
        'tax_amount',
        'total_amount',
        'currency',
        'notes_to_customer',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    public function invoice()
    {
        return $this->belongsTo(CustInvoice::class, 'invoice_id');
    }

    public function items()
    {
        return $this->hasMany(CustCreditNoteItem::class, 'credit_note_id');
    }
}