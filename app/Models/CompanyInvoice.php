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
        'invoice_date',
        'due_date',
        'subtotal_amount',
        'tax_amount',
        'total_amount',
        'currency',
        'exchange_rate',
        'invoice_status',
        'notes',
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
        return $this->hasMany(CompanyInvoiceItem::class, 'company_invoice_id');
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