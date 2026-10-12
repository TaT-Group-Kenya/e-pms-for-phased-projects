<?php

namespace App\Models;

use App\Models\Traits\HasLogicalDeletion;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupRole extends Model
{
    use HasFactory, HasLogicalDeletion;

    protected $table = 'group_roles';

    protected $fillable = [
        'group_id',
        'role_id',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    public function group()
    {
        return $this->belongsTo(SysGroup::class, 'group_id');
    }

    public function role()
    {
        return $this->belongsTo(SysRole::class, 'role_id');
    }
}
