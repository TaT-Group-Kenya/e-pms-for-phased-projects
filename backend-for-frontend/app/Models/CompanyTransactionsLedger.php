<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\HasLogicalDeletion;

class CompanyTransactionsLedger extends Model
{
    use HasLogicalDeletion;
    protected $table = 'company_transactions_ledger';

    protected $fillable = [
        'company_payment_id',
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
        'company_id',
        'customer_id',
        /** 
         * if refund source_type = credit note, 
         * if payment then source_type = internal 
         * bank account from Accounts tbl 
         * */
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
        return $this->belongsTo(CompanyPayment::class, 'company_payment_id');
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function relatedTransaction()
    {
        return $this->belongsTo(CompanyTransactionsLedger::class, 'related_transaction_id');
    }
}
