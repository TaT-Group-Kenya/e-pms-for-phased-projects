<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\HasLogicalDeletion;

class CompanyPayment extends Model
{
    use HasLogicalDeletion;
    protected $table = 'company_payments';

    public $timestamps = false;

    protected $fillable = [
        'transaction_id',
        'transaction_number',
        'invoice_id',
        'direction',
        'transaction_type',
        'amount_paid',
        'tax_amount',
        'net_amount',
        'payment_date',
        'payment_method',
        'payment_status',
        'currency',
        'exchange_rate',
        'forex_rate',
        'settlement_account_forex_rate',
        'transaction_cost',
        'project_currency_value',
        'project_currency',
        'bank_name',
        'check_number',
        'transaction_reference',
        'receipt_number',
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

    public function invoice()
    {
        return $this->belongsTo(CompanyInvoice::class, 'invoice_id');
    }

    public function companyLedgerEntries()
    {
        return $this->hasMany(CompanyTransactionsLedger::class, 'company_payment_id');
    }

    public function createdByUser()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}