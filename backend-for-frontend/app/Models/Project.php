<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $table = 'projects';

    protected $fillable = [
        'code',
        'name',
        'description',
        'customer_id',
        'project_category_id',
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
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function category()
    {
        return $this->belongsTo(ProjectCategory::class, 'project_category_id');
    }

    public function phases()
    {
        return $this->hasMany(ProjectPhase::class);
    }

    public function order()
    {
        return $this->hasOne(Order::class);
    }

    public function quotation()
    {
        return $this->hasOne(Quotation::class);
    }

    public function customer_invoices()
    {
        return $this->hasMany(CustInvoice::class);
    }

    public function company_invoices()
    {
        return $this->hasMany(CompanyInvoice::class);
    }
}