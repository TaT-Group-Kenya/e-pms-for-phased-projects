<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectPhase extends Model
{
    protected $table = 'project_phases';

    protected $fillable = [
        'code',
        'project_id',
        'name',
        'description',
        'phase_order',
        'status',
        'start_date',
        'end_date',
        'progress_percentage',
        'quote_item_id',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
    ];
    
    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function quoteItem()
    {
        return $this->belongsTo(QuoteLineItem::class, 'quote_item_id');
    }

    public function orderItem()
    {
        return $this->hasOne(OrderItem::class, 'project_phase_id');
    }

    public function assignment()
    {
        return $this->hasOne(CompanyProject::class, 'phase_id');
    }
}