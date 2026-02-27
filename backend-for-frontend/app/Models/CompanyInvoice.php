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
    ];

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
        return $this->hasMany(CompanyInvoicePayment::class, 'company_invoice_id');
    }

    public function taxitems()
    {
        return $this->hasMany(CompanyInvoiceTaxItem::class, 'company_invoice_id');
    }

    public function creditnotes()
    {
        return $this->hasMany(CompanyCreditNote::class, 'company_invoice_id');
    }

    public function documents()
    {
        return $this->hasMany(CompanyInvoiceDocument::class, 'company_invoice_id');
    }
    
}