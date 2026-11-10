<?php

namespace App\Models;

use App\Models\Traits\HasLogicalDeletion;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasLogicalDeletion;

    protected $table = 'transactions';

    // Chart codes by transaction_type: 'topup' rows credit asset accounts
    // (cash coming in — 1000), 'expense' rows are expense settlements
    // (5000), and loan repayment legs carry their own types: 'interest'
    // (5000) and 'loan_principal' (2000). Postings that break this pattern
    // are tagged explicitly at their creation sites.
    public const CHART_ASSET_CODE = '1000';

    public const CHART_EXPENSE_CODE = '5000';

    public const TYPE_TOPUP = 'topup';

    public const TYPE_EXPENSE = 'expense';

    public const TYPE_INTEREST = 'interest';

    public const TYPE_LOAN_PRINCIPAL = 'loan_principal';

    protected static ?int $assetChartId = null;

    protected static ?int $expenseChartId = null;

    protected static function booted(): void
    {
        // Default any un-tagged transaction by its transaction_type. Skips
        // the lookup when the chart table is unavailable so creation never
        // breaks (e.g. minimal test schemas).
        static::creating(function (self $transaction) {
            if (empty($transaction->chart_of_account)) {
                $transaction->chart_of_account = match ($transaction->transaction_type) {
                    self::TYPE_TOPUP => self::assetChartId(),
                    self::TYPE_INTEREST => self::expenseChartId(),
                    self::TYPE_LOAN_PRINCIPAL => null,
                    default => self::expenseChartId(),
                };
            }
        });
    }

    public static function assetChartId(): ?int
    {
        if (self::$assetChartId === null) {
            try {
                self::$assetChartId = (int) ChartOfAccount::where('code', self::CHART_ASSET_CODE)->value('id');
            } catch (\Throwable) {
                self::$assetChartId = 0;
            }
        }

        return self::$assetChartId ?: null;
    }

    public static function expenseChartId(): ?int
    {
        if (self::$expenseChartId === null) {
            try {
                self::$expenseChartId = (int) ChartOfAccount::where('code', self::CHART_EXPENSE_CODE)->value('id');
            } catch (\Throwable) {
                self::$expenseChartId = 0;
            }
        }

        return self::$expenseChartId ?: null;
    }

    protected $fillable = [
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
        'company_id',
        'source_type',
        'source_id',
        'account_debit',
        'account_credit',
        'chart_of_account',
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
        'should_apply_forex_to_stmt',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class, 'payment_method');
    }

    public function costCenter()
    {
        return $this->belongsTo(Department::class, 'cost_center_id');
    }

    public function relatedTransaction()
    {
        return $this->belongsTo(Transaction::class, 'related_transaction_id');
    }

    public function debitAccount()
    {
        return $this->belongsTo(Account::class, 'account_debit');
    }

    public function creditAccount()
    {
        return $this->belongsTo(Account::class, 'account_credit');
    }

    // Chart of accounts this posting is tagged with (5000 for expense
    // settlements such as office expenses and loan interest).
    public function chartOfAccount()
    {
        return $this->belongsTo(ChartOfAccount::class, 'chart_of_account');
    }
}
