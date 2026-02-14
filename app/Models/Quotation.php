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
        'tax_percentage',
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
}