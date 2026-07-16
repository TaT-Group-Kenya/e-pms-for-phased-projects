<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\HasLogicalDeletion;

class Quotation extends Model
{
    use HasLogicalDeletion;
    use HasLogicalDeletion;
    protected $table = 'quotations';

    protected $fillable = [
        'quotation_number',
        'job_reference_id',
        'customer_id',
        'project_owner_id',
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
        'payment_receiving_method_id',
        'payment_terms',
        'min_approval_count',
        'notes_to_customer',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function projectOwner()
    {
        return $this->belongsTo(ProjectOwner::class, 'project_owner_id');
    }

    public function receivingPaymentMethod()
    {
        return $this->belongsTo(\App\Models\PaymentReceivingMethod::class, 'payment_receiving_method_id');
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

    public function setJobReferenceIdAttribute($value): void
    {
        $this->attributes['job_reference_id'] = $value !== null
            ? strtoupper((string) $value)
            : null;
    }

    public function createdByUser()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedByUser()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}