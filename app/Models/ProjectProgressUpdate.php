<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectProgressUpdate extends Model
{
    protected $table = 'project_progress_updates';

    public $timestamps = false;

    protected $fillable = [
        'project_id',
        'update_title',
        'update_description',
        'progress_percentage',
        'update_date',
        'attachment',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
    ];
}