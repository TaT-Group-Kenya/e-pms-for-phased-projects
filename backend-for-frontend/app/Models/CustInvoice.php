<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\HasLogicalDeletion;

class CustInvoice extends Model
{
    use HasLogicalDeletion;
    protected $table = 'cust_invoices';

    protected $fillable = [
        'invoice_number',
        'order_id',
        'project_id',
        'customer_id',
        'job_reference_id',
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

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function invoiceItems()
    {
        return $this->hasMany(CustInvoiceItem::class, 'invoice_id');
    }

    public function payments()
    {
        return $this->belongsToMany(
            CustPayment::class,
            'cust_payment_allocations',
            'invoice_id',
            'payment_id'
        );
    }

    public function creditnotes()
    {
        return $this->hasMany(CustCreditNote::class, 'invoice_id');
    }

    public function documents()
    {
        return $this->hasMany(CustInvoiceDocument::class, 'invoice_id');
    }

    public function getStatusLabelAttribute()
    {
        $statusLabels = [
            'draft' => 'Draft',
            'sent' => 'Sent',
            'paid' => 'Paid',
            'overdue' => 'Overdue',
            'cancelled' => 'Cancelled',
        ];

        return $statusLabels[$this->status] ?? ucfirst($this->status);
    }
    
}