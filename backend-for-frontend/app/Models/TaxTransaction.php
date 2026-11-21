<?php

namespace App\Models;

use App\Models\Traits\HasLogicalDeletion;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaxTransaction extends Model
{
    use HasLogicalDeletion;

    // dr = tax reduces the liability (VAT_IN — recoverable VAT)
    // cr = tax increases the liability (VAT_OUT — output VAT)
    public const SIDE_DR = 'dr';

    public const SIDE_CR = 'cr';

    public const ENTRY_VAT_OUT = 'VAT_OUT';

    public const ENTRY_VAT_IN = 'VAT_IN';

    public const ENTRY_BALANCING = 'Balancing';

    protected $fillable = [
        'transaction_number',
        'tax_id',
        'side',
        'direction',
        'entry_type',
        'chart_of_account',
        'amount',
        'transaction_currency',
        'exchange_rate',
        'converted_amount',
        'running_balance',
        'transaction_date',
        'posted_date',
        'customer_id',
        'company_id',
        'supplier_or_customer',
        'kra_pin',
        'source_type',
        'source_id',
        'payment_id',
        'narration',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    protected $casts = [
        'transaction_date' => 'date:Y-m-d',
        'posted_date' => 'date:Y-m-d',
        'deleted_at' => 'datetime',
        'amount' => 'float',
        'exchange_rate' => 'float',
        'converted_amount' => 'float',
        'running_balance' => 'float',
    ];

    public function tax(): BelongsTo
    {
        return $this->belongsTo(Tax::class, 'tax_id');
    }

    public function chartOfAccount(): BelongsTo
    {
        return $this->belongsTo(ChartOfAccount::class, 'chart_of_account');
    }

    // The party (customer or company) the entry is attributable to.
    public function supplierOrCustomerCustomer()
    {
        return $this->belongsTo(Customer::class, 'supplier_or_customer');
    }

    public function supplierOrCustomerCompany()
    {
        return $this->belongsTo(Company::class, 'supplier_or_customer');
    }

    /**
     * Resolve the source document of this ledger entry (invoice, note...) via
     * source_type/source_id, with number, tax, party, currency and dates —
     * the shape used by the ledger UI detail view.
     */
    public function sourceDocument(): ?array
    {
        if ($this->source_type === null || $this->source_id === null) {
            return null;
        }

        try {
            return match ($this->source_type) {
                'cust_invoice' => $this->documentSummary(CustInvoice::class, 'invoice_number'),
                'customer_debit_note' => $this->documentSummary(CustDebitNote::class, 'debit_note_number'),
                'cust_credit_note' => $this->documentSummary(CustCreditNote::class, 'credit_note_number'),
                'company_invoice' => $this->documentSummary(CompanyInvoice::class, 'invoice_number'),
                'company_credit_note' => $this->documentSummary(CompanyCreditNote::class, 'credit_note_number'),
                // Tax bill settlements: particulars carry the funding account.
                'tax_bill' => $this->taxBillSummary(),
                default => null,
            };
        } catch (\Throwable) {
            // Minimal schemas may not carry the source document tables.
            return null;
        }
    }

    /**
     * Tax bill settlement summary. The bill number rides as `number`, and
     * `particulars` names the account the remittance was paid from so the
     * ledger reads "Tax bill settlement from account …".
     */
    protected function taxBillSummary(): ?array
    {
        $bill = TaxBill::withDeleted()->find($this->source_id);

        if (! $bill) {
            return null;
        }

        $accountName = null;
        $accountNumber = null;

        if ($bill->paid_from_account) {
            $account = \DB::table('accounts')->find((int) $bill->paid_from_account);
            if ($account) {
                $accountName = $account->name;
                $accountNumber = $account->code ?? ('#'.$account->id);
            }
        }

        return [
            'type' => 'tax_bill',
            'id' => (int) $bill->id,
            'number' => $bill->bill_number,
            'status' => $bill->status,
            'tax_amount' => (float) ($bill->paid_amount ?? 0),
            'total_amount' => (float) ($bill->amount ?? 0),
            'currency' => 'KES',
            'forex_rate' => 1.0,
            'document_date' => $bill->paid_date ?? $bill->created_at,
            'period' => $bill->periodIdentifier(),
            'particulars' => "Tax bill settlement from account {$accountNumber}",
            'account_name' => $accountName,
            'party_type' => 'authority',
            'party_id' => null,
            'party_name' => 'Kenya Revenue Authority',
            'kra_pin' => $accountNumber,
            'is_deleted' => (bool) $bill->is_deleted,
        ];
    }

    protected function documentSummary(string $modelClass, string $numberColumn): ?array
    {
        $document = $modelClass::withDeleted()->find($this->source_id);

        if (! $document) {
            return null;
        }

        $party = null;
        $partyType = null;

        try {
            if ($document instanceof CustInvoice) {
                $party = $document->customer_id ? Customer::find($document->customer_id) : null;
            } elseif ($document instanceof CustCreditNote || $document instanceof CustDebitNote) {
                $invoice = $document->invoice;
                $party = $invoice?->customer_id ? Customer::find($invoice->customer_id) : null;
            } elseif ($document instanceof CompanyInvoice) {
                $party = $document->company_id ? Company::find($document->company_id) : null;
            } elseif ($document instanceof CompanyCreditNote) {
                // The note table carries no company_id; reach it via the invoice.
                $party = $document->invoice?->company_id ? Company::find($document->invoice->company_id) : null;
            }
        } catch (\Throwable) {
            // Party lookups are best-effort (minimal schemas may lack the
            // columns the logical-deletion scope expects).
            $party = null;
        }

        if ($party) {
            $partyType = $document instanceof CustInvoice
                || $document instanceof CustCreditNote
                || $document instanceof CustDebitNote ? 'customer' : 'company';
        }

        return [
            'type' => $this->source_type,
            'id' => (int) $this->source_id,
            'number' => $document->{$numberColumn} ?? null,
            'status' => $document->status ?? null,
            'tax_amount' => (float) ($document->tax_amount ?? 0),
            'total_amount' => (float) ($document->total_amount ?? 0),
            'currency' => $document->currency ?? null,
            'forex_rate' => is_numeric($document->forex_rate ?? null) ? (float) $document->forex_rate : null,
            'document_date' => $document->created_at,
            'party_type' => $partyType,
            'party_id' => $party?->id,
            'party_name' => $party?->name ?? null,
            'kra_pin' => $party?->kra_pin ?? null,
            'is_deleted' => (bool) $document->is_deleted,
        ];
    }
}
