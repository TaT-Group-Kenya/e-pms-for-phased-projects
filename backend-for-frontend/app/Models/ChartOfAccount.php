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
        'is_bank_account_grp',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    // Bank accounts group only applies to the fixed standard codes.
    protected static array $bankAccountGroupCodes = ['1000', '2000'];

    protected $attributes = [
        'is_bank_account_grp' => false,
    ];

    protected static function booted(): void
    {
        static::saving(function (ChartOfAccount $chartOfAccount) {
            $chartOfAccount->is_bank_account_grp = in_array($chartOfAccount->code, self::$bankAccountGroupCodes, true);
        });
    }

    public function accounts(): HasMany
    {
        return $this->hasMany(Account::class, 'chart_of_account_id');
    }
}