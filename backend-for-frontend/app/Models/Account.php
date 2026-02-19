<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    protected $table = 'accounts';

    public $timestamps = false;

    protected $fillable = [
        'code',
        'name',
        'description',
        'type',
        'group',
        'balance',
        'overdraft_allowed',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
    ];
}