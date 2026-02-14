<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectPhase extends Model
{
    protected $table = 'project_phases';

    protected $fillable = [
        'project_id',
        'name',
        'description',
        'start_date',
        'end_date',
        'status',
        'budget',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}