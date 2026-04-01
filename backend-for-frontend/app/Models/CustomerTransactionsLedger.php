<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\HasLogicalDeletion;
use App\Models\CustInvoice;
use App\Models\CustCreditNote;

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

    public function createdByUser()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedByUser()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function deletedByUser()
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }

    public function customerInvoice()
    {
        if ($this->source_type === 'customer_credit_note') {
            return CustInvoice::with('project')
                ->whereHas('creditnotes', function ($query) {
                    $query->where('cust_credit_notes.id', $this->source_id);
                })
                ->first();
        }

        if (in_array($this->source_type, ['cust_invoice'], true)) {
            return CustInvoice::with('project')->find($this->source_id);
        }

        return null;
    }

    public function creditAccount()
    {
        return $this->belongsTo(Account::class, 'account_credit');
    }

    public function debitAccount()
    {
        return $this->belongsTo(Account::class, 'account_debit');
    }
}
