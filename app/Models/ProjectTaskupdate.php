<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectTaskUpdate extends Model
{
    protected $table = 'project_task_updates';

    protected $fillable = [
        'project_task_id',
        'update_note',
        'status',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
    ];
}