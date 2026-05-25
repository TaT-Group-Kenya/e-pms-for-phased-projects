<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\HasLogicalDeletion;

class PdcReceivedCustomer extends Model
{
    use HasLogicalDeletion;

    protected $table = 'pdc_received_customers';

    public $timestamps = false;

    protected $fillable = [
        'transaction_number',
        'customer_id',
        'invoice_id',
        'cheque_number',
        'cheque_date',
        'received_date',
        'amount',
        'currency',
        'bank',
        'bank_branch',
        'bank_account_id',
        'status',
        'narration',
        'related_transaction_id',
        'created_at',
        'created_by',
        'updated_at',
        'updated_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function bankAccount()
    {
        return $this->belongsTo(Account::class, 'bank_account_id');
    }

    public function invoice()
    {
        return $this->belongsTo(CustInvoice::class, 'invoice_id');
    }
}
