<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyProject extends Model
{
    protected $table = 'company_projects';

    public $timestamps = false;

    protected $fillable = [
        'project_id',
        'phase_id',
        'company_id',
        'is_complete',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function phase()
    {
        return $this->belongsTo(Phase::class, 'phase_id');
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }
}