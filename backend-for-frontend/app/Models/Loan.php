<?php

namespace App\Models;

use App\Models\Traits\HasLogicalDeletion;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Loan extends Model
{
    use HasLogicalDeletion;

    public const STATUS_PENDING_DISBURSEMENT = 'pending_disbursement';
    public const STATUS_ACTIVE = 'active';
    public const STATUS_CLOSED = 'closed';
    public const STATUS_RESTRUCTURED = 'restructured';

    public const INTEREST_NONE = 'none';
    public const INTEREST_FLAT = 'flat';
    public const INTEREST_REDUCING = 'reducing';

    public const FREQUENCY_MONTHLY = 'monthly';
    public const FREQUENCY_QUARTERLY = 'quarterly';
    public const FREQUENCY_WEEKLY = 'weekly';

    protected $table = 'loans';

    public $timestamps = false;

    protected $fillable = [
        'account_id',
        'lender_name',
        'principal',
        'currency',
        'interest_type',
        'interest_rate',
        'tenure_months',
        'repayment_frequency',
        'disbursement_date',
        'first_payment_date',
        'installment_amount',
        'status',
        'description',
        'disbursement_transaction_id',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    protected $casts = [
        'disbursement_date' => 'date',
        'first_payment_date' => 'date',
        'principal' => 'float',
        'interest_rate' => 'float',
        'installment_amount' => 'float',
    ];

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'account_id');
    }

    public function disbursementTransaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class, 'disbursement_transaction_id');
    }

    public function repayments(): HasMany
    {
        return $this->hasMany(LoanRepayment::class, 'loan_id')->orderBy('payment_date')->orderBy('id');
    }

    public function schedule(): HasMany
    {
        return $this->hasMany(LoanSchedule::class, 'loan_id')->orderBy('installment_number');
    }
}