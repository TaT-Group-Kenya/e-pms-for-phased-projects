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
        'estimated_hours_nullable',
        'custom_note',
        'is_taxable',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
    ];

    public function quotation()
    {
        return $this->belongsTo(Quotation::class, 'quotation_id');
    }

    public function projectPhase()
    {
        return $this->belongsTo(ProjectPhase::class, 'project_phase_id');
    }
}