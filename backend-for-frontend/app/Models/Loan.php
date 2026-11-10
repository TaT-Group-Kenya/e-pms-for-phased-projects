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
        'destination_account_id',
        'lender_name',
        'principal',
        'principal_kes',
        'currency',
        'chart_of_account',
        'interest_type',
        'interest_rate',
        'tenure_months',
        'repayment_frequency',
        'disbursement_date',
        'first_payment_date',
        'installment_amount',
        'installment_amount_kes',
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
        'principal_kes' => 'float',
        'installment_amount_kes' => 'float',
    ];

    protected static function booted(): void
    {
        // Loans default to the Liabilities chart (2000) — the Loan entity
        // is itself a liability on the books.
        static::creating(function (Loan $loan) {
            if (empty($loan->chart_of_account)) {
                $loan->chart_of_account = ChartOfAccount::where('code', '2000')->value('id');
            }
        });
    }

    // The loaned money is disbursed straight onto this asset account; the
    // Loan entity itself carries the liability.
    public function destination(): BelongsTo
    {
        return $this->belongsTo(Account::class, 'destination_account_id');
    }

    // The chart the loan is classified under; defaults to the Liabilities
    // chart (2000) since a loan is itself a liability position.
    public function chartOfAccount()
    {
        return $this->belongsTo(ChartOfAccount::class, 'chart_of_account');
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