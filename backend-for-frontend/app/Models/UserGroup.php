<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Traits\HasLogicalDeletion;

class UserGroup extends Model
{
    use HasFactory, HasLogicalDeletion;

    protected $table = 'user_groups';

    protected $fillable = [
        'user_id',
        'sys_group_id',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];
}