<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectCategory extends Model
{
    protected $table = 'project_categories';

    protected $fillable = [
        'name',
        'description',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
    ];
}