<?php

namespace App\Models;

use App\Models\Traits\HasLogicalDeletion;
use Illuminate\Database\Eloquent\Model;

class CustomerTransactionsLedger extends Model
{
    use HasLogicalDeletion;

    protected $table = 'customer_transactions_ledger';

    // Chart code that customer invoice payments and debit-note entries fall
    // under (Revenue/Income).
    public const CHART_REVENUE_CODE = '4000';

    protected static ?int $revenueChartId = null;

    protected static function booted(): void
    {
        // Default any un-tagged ledger row to the Revenue chart. Skips the
        // lookup when the chart table is unavailable (e.g. minimal test
        // schemas) so ledger creation never breaks.
        static::creating(function (self $ledger) {
            if (empty($ledger->chart_of_account)) {
                $ledger->chart_of_account = self::revenueChartId();
            }
        });
    }

    public static function revenueChartId(): ?int
    {
        if (self::$revenueChartId === null) {
            try {
                self::$revenueChartId = (int) ChartOfAccount::where('code', self::CHART_REVENUE_CODE)->value('id');
            } catch (\Throwable) {
                self::$revenueChartId = 0;
            }
        }

        return self::$revenueChartId ?: null;
    }

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

        if ($this->source_type === 'customer_debit_note') {
            $debitNote = CustDebitNote::with('invoice.project')->find($this->source_id);

            return $debitNote?->invoice;
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

    // Chart of accounts this entry is tagged with (e.g. 4000 Revenue/Income
    // for invoice payments and debit-note receipts).
    public function chartOfAccount()
    {
        return $this->belongsTo(ChartOfAccount::class, 'chart_of_account');
    }
}
