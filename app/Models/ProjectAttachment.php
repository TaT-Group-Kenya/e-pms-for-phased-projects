<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectAttachment extends Model
{
    protected $table = 'project_attachments';

    protected $fillable = [
        'project_id',
        'project_phase_id',
        'project_task_id',
        'file_name',
        'file_path',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
    ];
}