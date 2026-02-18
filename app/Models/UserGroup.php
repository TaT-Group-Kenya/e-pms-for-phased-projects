<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserGroup extends Model
{
    use HasFactory;

    protected $table = 'user_groups';

    protected $fillable = [
        'user_id',
        'sys_group_id',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function group()
    {
        return $this->belongsTo(SysGroup::class, 'sys_group_id');
    }

    public function permissions()
    {
        return $this->belongsToMany(
            SysPermission::class,
            'group_permissions',
            'sys_group_id',
            'sys_permission_id'
        );
    }
}