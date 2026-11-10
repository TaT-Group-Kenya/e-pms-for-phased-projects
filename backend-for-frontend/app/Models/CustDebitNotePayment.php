<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustDebitNotePayment extends Model
{
    protected $table = 'cust_debit_note_payments';

    protected $fillable = [
        'debit_note_id',
        'payment_id',
        'allocated_amount',
        'payment_date',
        'installment_number',
        'created_by',
        'updated_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    public function debitNote()
    {
        return $this->belongsTo(CustDebitNote::class, 'debit_note_id');
    }

    public function payment()
    {
        return $this->belongsTo(CustPayment::class, 'payment_id');
    }
}