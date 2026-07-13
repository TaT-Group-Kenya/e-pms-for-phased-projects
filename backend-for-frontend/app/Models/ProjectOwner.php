<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\HasLogicalDeletion;
use App\Models\User;

class ProjectOwner extends Model
{
    use HasLogicalDeletion;
    
    protected $table = 'project_owners';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'contact_person_name',
        'logo',
        'description',
        'address',
        'city',
        'state',
        'country',
        'kra_pin',
        'customer_id',
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
        return $this->belongsTo(Customer::class);
    }

    public function projects()
    {
        return $this->hasMany(Project::class, 'project_owner_id');
    }

    public function quotations()
    {
        return $this->hasMany(Quotation::class, 'project_owner_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'project_owner_id');
    }

    public function invoices()
    {
        return $this->hasMany(CustInvoice::class, 'project_owner_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
