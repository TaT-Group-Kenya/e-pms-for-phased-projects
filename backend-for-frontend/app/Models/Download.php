<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Download extends Model
{
    protected $table = 'downloads';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'path',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
    ];
}