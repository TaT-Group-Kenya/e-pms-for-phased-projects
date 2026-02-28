<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\HasLogicalDeletion;

class Account extends Model
{
    use HasLogicalDeletion;
    protected $table = 'accounts';

    public $timestamps = false;

    protected $fillable = [
        'code',
        'name',
        'description',
        'type',
        'group',
        'currency',
        'balance',
        'overdraft_allowed',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

}