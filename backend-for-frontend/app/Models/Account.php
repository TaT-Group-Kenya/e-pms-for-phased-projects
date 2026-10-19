<?php

namespace App\Models;

use App\Models\Traits\HasLogicalDeletion;
use Illuminate\Database\Eloquent\Model;

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
        'chart_of_account_id',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    public function chartOfAccount()
    {
        return $this->belongsTo(ChartOfAccount::class, 'chart_of_account_id');
    }

    public function loans()
    {
        return $this->hasMany(Loan::class, 'account_id');
    }
}
