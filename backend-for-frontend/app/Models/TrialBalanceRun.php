<?php

namespace App\Models;

use App\Models\Traits\HasLogicalDeletion;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TrialBalanceRun extends Model
{
    use HasLogicalDeletion;

    protected $table = 'trial_balance_runs';

    protected $fillable = [
        'run_number',
        'as_at_date',
        'forex_rate',
        'base_currency',
        'trigger',
        'accounting_period_id',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    protected $casts = [
        'as_at_date' => 'date',
        'forex_rate' => 'float',
    ];

    public function lines(): HasMany
    {
        return $this->hasMany(TrialBalanceRunLine::class, 'trial_balance_run_id');
    }
}
