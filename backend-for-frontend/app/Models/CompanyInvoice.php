<?php

namespace App\Models;

use App\Models\Traits\HasLogicalDeletion;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class CompanyInvoice extends Model
{
    use HasLogicalDeletion;

    protected $table = 'company_invoices';

    public $timestamps = false;

    protected $fillable = [
        'invoice_number',
        'project_id',
        'company_id',
        'project_phase_id',
        'title',
        'description',
        'status',
        'subtotal_amount',
        'tax_amount',
        'discount_percentage',
        'discount_amount',
        'total_amount',
        'currency',
        'payment_terms',
        'notes_to_customer',
        'valid_until',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function invoiceItems()
    {
        return $this->hasMany(CompanyInvoiceItem::class, 'invoice_id');
    }

    public function payments()
    {
        // Payments are stored in company_payments with an invoice_id foreign key
        return $this->hasMany(CompanyPayment::class, 'invoice_id')->where('payment_type', 'normal');
    }

    public function pdcsIssued()
    {
        return $this->hasMany(PdcIssuedCompany::class, 'invoice_id');
    }

    /**
     * Get the total amount paid to this invoice so far.
     *
     * @return float
     */
    public function getTotalPaidAttribute()
    {
        // Eager load payments if not loaded
        $payments = $this->payments;
        if ($payments && $payments->count() > 0) {
            return (float) $payments->sum('amount_paid');
        }

        return 0.0;
    }

    public function creditnotes()
    {
        // Credit notes also reference the invoice by invoice_id
        return $this->hasMany(CompanyCreditNote::class, 'invoice_id');
    }

    public function documents()
    {
        // Supporting documents reference the invoice via invoice_id
        return $this->hasMany(CompanyInvoiceDocument::class, 'invoice_id');
    }

    /**
     * Keep every derived amount copy of this invoice in sync after line items
     * change: the invoice-level company_transactions_ledger row created when the
     * invoice was marked sent, the paid/partially-paid status vs recorded
     * payments, billed flags on the invoiced project phases and the cached PDF.
     */
    public function syncDerivedAmounts(): void
    {
        $invoiceTotal = (float) $this->total_amount;
        $invoiceTax = (float) $this->tax_amount;
        $invoiceSubtotal = (float) $this->subtotal_amount;
        $invoiceDiscount = (float) $this->discount_amount;
        $netAmount = $invoiceSubtotal - $invoiceDiscount;

        // Invoice-level ledger row (transaction_type=invoice) created when the
        // invoice was marked sent. Payment rows (transaction_type=payment) and
        // credit note refunds keep their own payment-time amounts.
        CompanyTransactionsLedger::where('source_type', 'company_invoice')
            ->where('source_id', $this->id)
            ->where('transaction_type', 'invoice')
            ->where('is_deleted', false)
            ->update([
                'amount' => $invoiceTotal,
                'tax_amount' => $invoiceTax,
                'net_amount' => $netAmount,
                'updated_at' => now(),
            ]);

        // Reconcile the invoice status once it has left draft: totals may now
        // exceed or fall below what has already been paid. Draft and cancelled
        // invoices keep their status.
        if (in_array($this->status, ['sent', 'paid', 'partially-paid', 'overdue'], true)) {
            $paidTotal = (float) CompanyPayment::where('invoice_id', $this->id)
                ->where('is_deleted', false)
                ->where('direction', 'outgoing')
                ->where('payment_type', 'normal')
                ->sum('amount_paid');

            $previousStatus = $this->status;

            if ($paidTotal > 0 && $paidTotal >= $invoiceTotal) {
                $this->status = 'paid';
                $this->markPhasesBilled();
            } elseif ($paidTotal > 0) {
                $this->status = 'partially-paid';
            } elseif (in_array($previousStatus, ['paid', 'partially-paid'], true)) {
                // Payments were removed or the total was raised past them.
                $this->status = 'sent';
            }
            // Otherwise keep 'sent' or 'overdue' as-is.

            $this->updated_at = now();
            $this->save();
        }

        // Cached PDF (if any) no longer matches the new amounts.
        $download = Download::where('name', $this->invoice_number)->first();
        if ($download && Storage::disk('public')->exists($download->path)) {
            Storage::disk('public')->delete($download->path);
        }
    }

    protected function markPhasesBilled(): void
    {
        $phaseIds = $this->invoiceItems()
            ->whereNotNull('project_phase_id')
            ->pluck('project_phase_id')
            ->unique()
            ->toArray();

        if (! empty($phaseIds)) {
            ProjectPhase::whereIn('id', $phaseIds)->update(['is_billed' => true]);
        }
    }
}
