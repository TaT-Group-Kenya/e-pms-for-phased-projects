<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\HasLogicalDeletion;

class Order extends Model
{
    use HasLogicalDeletion;
    protected $table = 'orders';

    protected $fillable = [
        'order_number',
        'job_reference_id',
        'quotation_id',
        'project_id',
        'customer_id',
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
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    public function quotation()
    {
        return $this->belongsTo(Quotation::class, 'quotation_id');
    }

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }

    public function documents()
    {
        return $this->hasMany(OrderDocument::class, 'order_id');
    }

    public function custInvoices()
    {
        return $this->hasMany(CustInvoice::class, 'order_id');
    }

    public function setJobReferenceIdAttribute($value): void
    {
        $this->attributes['job_reference_id'] = $value !== null
            ? strtoupper((string) $value)
            : null;
    }
}