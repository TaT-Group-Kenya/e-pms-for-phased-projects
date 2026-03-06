<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tax extends Model
{
    protected $table = 'taxes';

    public $timestamps = false;

    protected $fillable = [
        'code',
        'name',
        'rate',
        'is_default',
        'description',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];
}