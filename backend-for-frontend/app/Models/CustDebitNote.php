<?php

namespace App\Models;

use App\Models\Traits\HasLogicalDeletion;
use Illuminate\Database\Eloquent\Model;

class CustDebitNote extends Model
{
    use HasLogicalDeletion;

    protected $table = 'cust_debit_notes';

    protected $fillable = [
        'debit_note_number', 'invoice_id', 'title', 'description', 'status',
        'subtotal_amount', 'tax_amount', 'total_amount', 'currency',
        'notes_to_customer', 'updated_at', 'updated_by', 'created_at',
        'created_by', 'is_deleted', 'deleted_at', 'deleted_by',
    ];

    public function invoice()
    {
        return $this->belongsTo(CustInvoice::class, 'invoice_id');
    }

    public function items()
    {
        return $this->hasMany(CustDebitNoteItem::class, 'debit_note_id');
    }

    public function documents()
    {
        return $this->hasMany(CustDebitNoteDocument::class, 'debit_note_id');
    }
}
