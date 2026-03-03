<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use App\Models\Traits\HasLogicalDeletion;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasLogicalDeletion;

    protected $table = 'users';

    protected $fillable = [
        'email',
        'first_name',
        'middle_name',
        'last_name',
        'password',
        'email_verified_at',
        'updated_by',
        'created_by',
        'remember_token',
        'avatar_pic',
        'category',
        'is_active',
        'company_id',
        'customer_id',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function groups()
    {
        return $this->belongsToMany(
            SysGroup::class,
            'user_groups',
            'user_id',
            'sys_group_id'
        );
    }

    public function hasPermission($permissionName)
    {
        foreach ($this->groups as $group) {
            if ($group->permissions()->where('name', $permissionName)->exists()) {
                return true;
            }
        }
        return false;
    }
}