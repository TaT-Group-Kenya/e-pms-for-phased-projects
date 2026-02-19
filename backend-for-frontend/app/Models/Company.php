<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $table = 'companies';

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
    ];
}