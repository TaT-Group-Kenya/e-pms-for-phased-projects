<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustPayment extends Model
{
    protected $table = 'cust_payments';

    public $timestamps = true;

    protected $fillable = [
        'transaction_id',
        'amount_paid',
        'payment_date',
        'payment_method',
        'payment_status',
        'currency',
        'bank_name',
        'check_number',
        'transaction_reference',
        'receipt_number',
        'invoice_total_amount',
        'exchange_rate',
        'fee_or_charge',
        'reconciled',
        'reconciliation_date',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class, 'transaction_id');
    }

    public function allocations()
    {
        return $this->hasMany(CustPaymentAllocation::class, 'payment_id');
    }

    public function invoices()
    {
        return $this->hasManyThrough(
            CustInvoice::class,
            CustPaymentAllocation::class,
            'payment_id',
            'id',
            'id',
            'invoice_id'
        );
    }
}
