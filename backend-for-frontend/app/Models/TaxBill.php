<?php

namespace App\Models;

use App\Models\Traits\HasLogicalDeletion;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class TaxBill extends Model
{
    use HasLogicalDeletion;

    protected $table = 'tax_bills';

    public const STATUS_PENDING_PAYMENT = 'pending_payment';

    public const STATUS_PAID = 'paid';

    protected $fillable = [
        'bill_number',
        'period_month',
        'period_year',
        'vat_out',
        'vat_in',
        'vat_liability',
        'amount',
        'paid_amount',
        'settled_for_period',
        'carried_forward',
        'balance',
        'status',
        'run_date',
        'paid_date',
        'payment_id',
        'transaction_id',
        'tax_ledger_entry_id',
        'paid_from_account',
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
        'run_date' => 'date:Y-m-d',
        'paid_date' => 'date:Y-m-d',
        'paid_amount' => 'float',
        'settled_for_period' => 'float',
        'carried_forward' => 'float',
        'balance' => 'float',
        'amount' => 'float',
        'vat_out' => 'float',
        'vat_in' => 'float',
        'vat_liability' => 'float',
        'period_month' => 'integer',
        'period_year' => 'integer',
    ];

    /** Settling transaction in the transactions ledger, if paid. */
    public function transaction()
    {
        return $this->belongsTo(Transaction::class, 'transaction_id');
    }

    public function paidFromAccountModel()
    {
        return $this->belongsTo(Account::class, 'paid_from_account');
    }

    /** The tax ledger entry that reduced the liability when paid. */
    public function taxLedgerEntry()
    {
        return $this->belongsTo(TaxTransaction::class, 'tax_ledger_entry_id');
    }

    public function createdByUser()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function label(): string
    {
        return 'VAT Bill '.Carbon::create($this->period_year, $this->period_month, 1)
            ->format('F Y');
    }

    public function periodIdentifier(): string
    {
        return sprintf('%04d-%02d', $this->period_year, $this->period_month);
    }

    public function isPaid(): bool
    {
        return $this->status === self::STATUS_PAID;
    }
}
