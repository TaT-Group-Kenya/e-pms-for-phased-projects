<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\HasLogicalDeletion;

class OfficeExpensePayment extends Model
{
    use HasLogicalDeletion;
    protected $table = 'office_expense_payments';

    protected $fillable = [
        'expense_id',
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
        'exchange_rate',
        'bank_name',
        'check_number',
        'transaction_reference',
        'receipt_number',
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

    public function expense()
    {
        return $this->belongsTo(OfficeExpense::class, 'expense_id');
    }
}
