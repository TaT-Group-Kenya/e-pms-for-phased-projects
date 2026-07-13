<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\HasLogicalDeletion;

class CustPayment extends Model
{
    use HasLogicalDeletion;
    protected $table = 'cust_payments';

    public $timestamps = true;

    protected $fillable = [
        'transaction_id',
        'transaction_number',
        'direction',
        'transaction_type',
        'amount_paid',
        'tax_amount',
        'net_amount',
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
        'transaction_cost',
        'payment_type',
        'reconciled',
        'reconciliation_date',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    public function customerLedgerEntries()
    {
        return $this->hasMany(CustomerTransactionsLedger::class, 'cust_payment_id');
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
        )->with(['customer', 'project']);
    }

    public function createdByUser()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
