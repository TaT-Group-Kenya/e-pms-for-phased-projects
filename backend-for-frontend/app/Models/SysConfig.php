<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SysConfig extends Model
{
    protected $table = 'sys_configs';

    public $timestamps = false;

    protected $fillable = [
        'readonly',
        'name',
        'value',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];
}