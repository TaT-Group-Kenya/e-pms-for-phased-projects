<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectTask extends Model
{
    protected $table = 'project_tasks';

    protected $fillable = [
        'project_id',
        'project_phase_id',
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
}