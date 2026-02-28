<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustPaymentAllocation extends Model
{
    protected $table = 'cust_payment_allocations';

    public $timestamps = false;

    protected $fillable = [
        'payment_id',
        'invoice_id',
        'allocated_amount',
        'allocation_date',
        'balance_before_payment',
        'balance_after_payment',
        'installment_number',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    public function payment()
    {
        return $this->belongsTo(CustPayment::class, 'payment_id');
    }

    public function invoice()
    {
        return $this->belongsTo(CustInvoice::class, 'invoice_id');
    }

}