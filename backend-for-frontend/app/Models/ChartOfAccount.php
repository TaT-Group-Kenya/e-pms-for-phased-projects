<?php

namespace App\Models;

use App\Models\Traits\HasLogicalDeletion;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChartOfAccount extends Model
{
    use HasLogicalDeletion;

    protected $table = 'chart_of_accounts';

    public $timestamps = false;

    protected $fillable = [
        'code',
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

    public function accounts(): HasMany
    {
        return $this->hasMany(Account::class, 'chart_of_account_id');
    }
}