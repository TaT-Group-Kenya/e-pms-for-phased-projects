<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\HasLogicalDeletion;

class CustomerTransactionsLedger extends Model
{
    use HasLogicalDeletion;
    protected $table = 'customer_transactions_ledger';

    protected $fillable = [
        'cust_payment_id',
        'transaction_number',
        'transaction_type',
        'transaction_date',
        'posted_date',
        'amount',
        'transaction_currency',
        'base_currency',
        'exchange_rate',
        'converted_amount',
        'converted_tax_amount',
        'converted_net_amount',
        'tax_amount',
        'net_amount',
        'customer_id',
        'source_type',
        'source_id',
        'account_debit',
        'account_credit',
        'category',
        'payment_method',
        'bank_account',
        'check_number',
        'transaction_status',
        'related_transaction_id',
        'narration',
        'is_recurring',
        'fiscal_year',
        'accounting_period',
        'is_adjusting_entry',
        'cost_center_id',
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
        return $this->belongsTo(CustPayment::class, 'cust_payment_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function relatedTransaction()
    {
        return $this->belongsTo(CustomerTransactionsLedger::class, 'related_transaction_id');
    }
}
