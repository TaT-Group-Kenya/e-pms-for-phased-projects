<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Traits\HasLogicalDeletion;

class SysGroup extends Model
{
    use HasFactory, HasLogicalDeletion;

    protected $table = 'sys_groups';

    protected $fillable = [
        'name',
        'description',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    public function roles()
    {
        return $this->belongsToMany(
            SysRole::class,
            'group_roles',
            'group_id',
            'role_id'
        )->where('sys_roles.is_deleted', false);
    }

    public function users()
    {
        return $this->belongsToMany(
            User::class,
            'user_groups',
            'sys_group_id',
            'user_id'
        );
    }
}