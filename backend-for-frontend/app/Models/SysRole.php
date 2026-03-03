<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Traits\HasLogicalDeletion;

class SysRole extends Model
{
    use HasFactory, HasLogicalDeletion;

    protected $table = 'sys_roles';

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