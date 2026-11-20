<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AccountingPeriodLog extends Model
{
    public const ACTION_CLOSED = 'closed';
    public const ACTION_REOPENED = 'reopened';

    protected $table = 'accounting_period_logs';

    public $timestamps = true;

    protected $fillable = [
        'accounting_period_id',
        'action',
        'performed_by',
        'performed_at',
        'reason',
        'snapshot_run_id',
    ];

    protected $casts = [
        'performed_at' => 'datetime',
    ];

    public function period(): BelongsTo
    {
        return $this->belongsTo(AccountingPeriod::class, 'accounting_period_id');
    }

    public function snapshot(): BelongsTo
    {
        return $this->belongsTo(TrialBalanceRun::class, 'snapshot_run_id');
    }
}
