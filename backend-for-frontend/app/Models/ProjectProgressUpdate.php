<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectProgressUpdate extends Model
{
    protected $table = 'project_progress_updates';

    public $timestamps = false;

    protected $fillable = [
        'project_id',
        'project_phase_id',
        'percentage_complete',
        'comment',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function projectPhase()
    {
        return $this->belongsTo(ProjectPhase::class, 'project_phase_id');
    }
}