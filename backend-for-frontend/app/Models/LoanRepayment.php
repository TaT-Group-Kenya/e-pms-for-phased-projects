<?php

namespace App\Models;

use App\Models\Traits\HasLogicalDeletion;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LoanRepayment extends Model
{
    protected $table = 'loan_repayments';

    public $timestamps = false;

    protected $fillable = [
        'loan_id',
        'transaction_id',
        'schedule_installment_id',
        'payment_date',
        'amount_paid',
        'principal_component',
        'interest_component',
        'balance_after',
        'paid_from_account_id',
        'payment_reference',
        'notes',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    protected $casts = [
        'payment_date' => 'date',
        'amount_paid' => 'float',
        'principal_component' => 'float',
        'interest_component' => 'float',
        'balance_after' => 'float',
    ];

    public function loan(): BelongsTo
    {
        return $this->belongsTo(Loan::class, 'loan_id');
    }

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class, 'transaction_id');
    }

    public function paidFromAccount(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'paid_from_account_id');
    }

    public function scheduleInstallment(): BelongsTo
    {
        return $this->belongsTo(LoanSchedule::class, 'schedule_installment_id');
    }
}