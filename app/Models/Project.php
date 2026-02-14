<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $table = 'projects';

    protected $fillable = [
        'name',
        'description',
        'company_id',
        'customer_id',
        'project_category_id',
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