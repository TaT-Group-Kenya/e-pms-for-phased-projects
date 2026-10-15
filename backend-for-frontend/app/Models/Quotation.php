<?php

namespace App\Models;

use App\Models\Traits\HasLogicalDeletion;
use Illuminate\Database\Eloquent\Model;

class Quotation extends Model
{
    use HasLogicalDeletion;
    use HasLogicalDeletion;

    protected $table = 'quotations';

    protected $fillable = [
        'quotation_number',
        'bol_number',
        'ship_container_id',
        'customer_id',
        'project_owner_id',
        'title',
        'description',
        'status',
        'valid_until_date',
        'clearance_deadline',
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

    public function shipContainer()
    {
        return $this->belongsTo(ShipContainer::class, 'ship_container_id');
    }

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
        return $this->belongsTo(PaymentReceivingMethod::class, 'payment_receiving_method_id');
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

    public function setBolNumberAttribute($value): void
    {
        $this->attributes['bol_number'] = $value !== null
            ? strtoupper((string) $value)
            : null;
    }

    /**
     * Keep the historical bol_number column in sync with the linked ship
     * container's single BOL/BL number so orders/invoices/PDFs that still
     * read this column keep working. (The container-number list is tracked
     * on the ship container entry itself, not here.)
     */
    public function syncBolNumberFromContainer(): void
    {
        if (! $this->ship_container_id) {
            return;
        }

        $bolNumber = $this->shipContainer?->documentNumber();

        if ($bolNumber !== $this->bol_number) {
            $this->bol_number = $bolNumber;
            $this->save();
        }
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
