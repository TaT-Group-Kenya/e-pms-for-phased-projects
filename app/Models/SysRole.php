<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SysRole extends Model
{
    use HasFactory;

    protected $table = 'sys_roles';

    protected $fillable = [
        'name',
        'description',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
    ];

    public function groups()
    {
        return $this->belongsToMany(
            SysGroup::class,
            'group_roles',
            'role_id',
            'group_id'
        );
    }
}