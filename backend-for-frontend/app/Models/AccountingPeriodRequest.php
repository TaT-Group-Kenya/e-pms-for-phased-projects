<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A maker/checker (four-eyes) request for closing or reopening an
 * accounting period. Submitted by a maker; approved or rejected by a
 * different user acting as checker. Approval executes the operation.
 */
class AccountingPeriodRequest extends Model
{
    public const ACTION_CLOSE = 'close';
    public const ACTION_REOPEN = 'reopen';

    public const STATUS_PENDING = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_CANCELLED = 'cancelled';

    protected $table = 'accounting_period_requests';

    protected $fillable = [
        'accounting_period_id',
        'action',
        'status',
        'requested_by',
        'requested_at',
        'reason',
        'forex_rate',
        'checklist_summary',
        'reviewed_by',
        'reviewed_at',
        'review_note',
        'executed_log_id',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'requested_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'forex_rate' => 'float',
    ];

    public function period(): BelongsTo
    {
        return $this->belongsTo(AccountingPeriod::class, 'accounting_period_id');
    }

    /** The audit entry written when the checker approved execution. */
    public function executedLog(): BelongsTo
    {
        return $this->belongsTo(AccountingPeriodLog::class, 'executed_log_id');
    }
}
