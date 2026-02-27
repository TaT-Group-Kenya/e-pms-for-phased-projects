<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quotation extends Model
{
    protected $table = 'quotations';

    protected $fillable = [
        'quotation_number',
        'project_id',
        'customer_id',
        'title',
        'description',
        'status',
        'valid_until_date',
        'subtotal_amount',
        'tax_amount',
        'discount_percentage',
        'discount_amount',
        'total_amount',
        'currency',
        'payment_terms',
        'min_approval_count',
        'notes_to_customer',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }
    
    public function quoteItems()
    {
        return $this->hasMany(QuoteLineItem::class, 'quotation_id');
    }
    
    public function documents()
    {
        return $this->hasMany(QuoteDocument::class, 'quotation_id');
    }

    public function approvals()
    {
        return $this->hasMany(QuoteApproval::class, 'quote_id');
    }

    public function order()
    {
        return $this->hasOne(Order::class, 'quotation_id');
    }

    public function taxitems()
    {
        return $this->hasMany(QuotationTaxItem::class, 'quotation_id');
    }
}