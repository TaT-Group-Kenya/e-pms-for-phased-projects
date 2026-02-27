<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustCreditNote extends Model
{
    protected $table = 'cust_credit_notes';

    protected $fillable = [
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
    ];

    public function invoice()
    {
        return $this->belongsTo(CustInvoice::class, 'invoice_id');
    }
}