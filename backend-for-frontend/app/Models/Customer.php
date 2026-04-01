<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\HasLogicalDeletion;
use App\Models\User;

class Customer extends Model
{
    use HasLogicalDeletion;
    protected $table = 'customers';

    protected $fillable = [
        'name',
        'description',
        'email',
        'phone',
        'contact_person_name',
        'logo',
        'address',
        'city',
        'state',
        'country',
        'kra_pin',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    public function users()
    {
        return $this->hasMany(User::class, 'customer_id');
    }

    public function projects()
    {
        return $this->hasMany(Project::class, 'customer_id');
    }

    public function quotations()
    {
        return $this->hasMany(Quotation::class, 'customer_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'customer_id');
    }

    public function invoices()
    {
        return $this->hasMany(CustInvoice::class, 'customer_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}