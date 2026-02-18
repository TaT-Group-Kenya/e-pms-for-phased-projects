<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class GroupRole extends Model
{
    use HasFactory;

    protected $table = 'group_roles';

    protected $fillable = [
        'group_id',
        'role_id',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
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