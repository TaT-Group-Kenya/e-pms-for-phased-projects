<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrialBalanceRunLine extends Model
{
    protected $table = 'trial_balance_run_lines';

    protected $fillable = [
        'trial_balance_run_id',
        'chart_of_account',
        'category',
        'source_table',
        'source_type',
        'source_id',
        'account_id',
        'debit_kes',
        'credit_kes',
        'debit_usd',
        'credit_usd',
        'description',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'debit_kes' => 'float',
        'credit_kes' => 'float',
        'debit_usd' => 'float',
        'credit_usd' => 'float',
    ];

    public function run(): BelongsTo
    {
        return $this->belongsTo(TrialBalanceRun::class, 'trial_balance_run_id');
    }

    public function chartOfAccount(): BelongsTo
    {
        return $this->belongsTo(ChartOfAccount::class, 'chart_of_account');
    }
}
