<?php

namespace App\Models;

use App\Models\Traits\HasLogicalDeletion;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompanyTransactionsLedger extends Model
{
    use HasLogicalDeletion;

    protected $table = 'company_transactions_ledger';

    // Default chart code for company ledger entries: company invoices and
    // PDC issuances are liabilities (2000). Company credit-note entries are
    // revenue (4000) and are tagged explicitly at creation.
    public const CHART_LIABILITY_CODE = '2000';

    protected static ?int $liabilityChartId = null;

    protected static function booted(): void
    {
        // Default any un-tagged ledger row to the Liabilities chart. Skips
        // the lookup when the chart table is unavailable (e.g. minimal test
        // schemas) so ledger creation never breaks.
        static::creating(function (self $ledger) {
            if (empty($ledger->chart_of_account)) {
                $ledger->chart_of_account = self::liabilityChartId();
            }
        });
    }

    public static function liabilityChartId(): ?int
    {
        if (self::$liabilityChartId === null) {
            try {
                self::$liabilityChartId = (int) ChartOfAccount::where('code', self::CHART_LIABILITY_CODE)->value('id');
            } catch (\Throwable) {
                self::$liabilityChartId = 0;
            }
        }

        return self::$liabilityChartId ?: null;
    }

    protected $fillable = [
        'company_payment_id',
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
        'company_id',
        'customer_id',
        /**
         * if refund source_type = credit note,
         * if payment then source_type = internal
         * bank account from Accounts tbl
         * */
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

    public function companyInvoice()
    {
        if ($this->source_type === 'company_credit_note') {
            return CompanyInvoice::with('project')
                ->whereHas('creditnotes', function ($query) {
                    $query->where('company_credit_notes.id', $this->source_id);
                })
                ->first();
        }

        if ($this->source_type === 'company_invoice') {
            return CompanyInvoice::with('project')->find($this->source_id);
        }

        return null;
    }

    public function payment()
    {
        return $this->belongsTo(CompanyPayment::class, 'company_payment_id');
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function relatedTransaction()
    {
        return $this->belongsTo(CompanyTransactionsLedger::class, 'related_transaction_id');
    }

    // Chart of accounts this entry is tagged with (2000 for company
    // invoices/payments, 4000 for company credit-note refunds).
    public function chartOfAccount()
    {
        return $this->belongsTo(ChartOfAccount::class, 'chart_of_account');
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

    public function debitAccount()
    {
        return $this->belongsTo(Account::class, 'account_debit');
    }

    public function creditAccount()
    {
        return $this->belongsTo(Account::class, 'account_credit');
    }
}
