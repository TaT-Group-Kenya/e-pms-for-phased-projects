<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuoteLineItem extends Model
{
    protected $table = 'quote_line_items';

    protected $fillable = [
        'quotation_id',
        'project_phase_id',
        'phase_name',
        'phase_description',
        'quoted_amount',
        'estimated_hours',
        'custom_note',
        'is_taxable',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
    ];
}