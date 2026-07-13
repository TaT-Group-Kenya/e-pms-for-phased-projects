<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\HasLogicalDeletion;
use App\Models\User;

class Project extends Model
{
    use HasLogicalDeletion;
    protected $table = 'projects';

    protected $fillable = [
        'code',
        'name',
        'job_reference_id',
        'description',
        'order_id',
        'customer_id',
        'project_owner_id',
        'project_category_id',
        'project_source_origin_id',
        'project_location_id',
        'no_of_phases',
        'start_date',
        'end_date',
        'budget_estimate',
        'status',
        'priority',
        'progress',
        'tags',
        'currency',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function projectOwner()
    {
        return $this->belongsTo(ProjectOwner::class, 'project_owner_id');
    }

    public function category()
    {
        return $this->belongsTo(ProjectCategory::class, 'project_category_id');
    }

    public function sourceOrigin()
    {
        return $this->belongsTo(ProjectSourceOrigin::class, 'project_source_origin_id');
    }

    public function location()
    {
        return $this->belongsTo(ProjectLocation::class, 'project_location_id');
    }

    public function phases()
    {
        return $this->hasMany(ProjectPhase::class);
    }

    public function order()
    {
        return $this->hasOne(Order::class, 'project_id');
    }

    public function customer_invoice()
    {
        return $this->hasOne(CustInvoice::class, 'project_id');
    }

    public function company_invoices()
    {
        return $this->hasMany(CompanyInvoice::class, 'project_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}