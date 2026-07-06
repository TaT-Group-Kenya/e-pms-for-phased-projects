<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyInvoice extends Model
{
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
        return $this->hasMany(CompanyPayment::class, 'invoice_id');
    }

    public function pdcsIssued()
    {
        return $this->hasMany(\App\Models\PdcIssuedCompany::class, 'invoice_id');
    }

    /**
     * Get the total amount paid to this invoice so far.
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
    
}