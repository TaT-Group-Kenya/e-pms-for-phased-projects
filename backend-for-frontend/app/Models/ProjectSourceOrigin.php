<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\HasLogicalDeletion;

class ProjectSourceOrigin extends Model
{
    use HasLogicalDeletion;

    protected $table = 'project_source_origins';

    protected $fillable = [
        'code',
        'name',
        'description',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    public function projects()
    {
        return $this->hasMany(Project::class, 'project_source_origin_id');
    }
}
