<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    protected $table = 'countries';

    public $timestamps = false;

    protected $fillable = [
        'code',
        'dial_code',
        'name',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
    ];
}