<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $table = 'transactions';

    protected $fillable = [
        'transaction_number',
        'transaction_type',
        'transaction_date',
        'posted_date',
        'amount',
        'base_currency',
        'exchange_rate',
        'converted_amount',
        'tax_amount',
        'net_amount',
        'customer_id',
        'company_id',
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
    ];
}