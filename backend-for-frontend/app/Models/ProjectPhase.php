<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\HasLogicalDeletion;

class ProjectPhase extends Model
{
    use HasLogicalDeletion;
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
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];
    
    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function assignment()
    {
        return $this->hasOne(CompanyProject::class, 'phase_id');
    }
}