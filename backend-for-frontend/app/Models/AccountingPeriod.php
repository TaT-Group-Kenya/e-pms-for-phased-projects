<?php

namespace App\Models;

use App\Models\Traits\HasLogicalDeletion;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AccountingPeriod extends Model
{
    use HasLogicalDeletion;

    public const TYPE_YEAR = 'year';
    public const TYPE_QUARTER = 'quarter';
    public const TYPE_MONTH = 'month';

    public const STATUS_OPEN = 'open';
    public const STATUS_CLOSED = 'closed';

    protected $table = 'accounting_periods';

    protected $fillable = [
        'period_type',
        'fiscal_year',
        'quarter',
        'month',
        'name',
        'start_date',
        'end_date',
        'status',
        'closed_at',
        'closed_by',
        'closed_at_snapshot',
        'reopened_at',
        'reopened_by',
        'last_reopen_reason',
        'created_by',
        'updated_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'closed_at' => 'datetime',
        'closed_at_snapshot' => 'datetime',
        'reopened_at' => 'datetime',
        'is_deleted' => 'boolean',
        'fiscal_year' => 'integer',
        'quarter' => 'integer',
        'month' => 'integer',
    ];

    public function logs(): HasMany
    {
        return $this->hasMany(AccountingPeriodLog::class, 'accounting_period_id')
            ->orderByDesc('performed_at');
    }

    public function snapshots(): HasMany
    {
        return $this->hasMany(TrialBalanceRun::class, 'accounting_period_id');
    }

    public function isOpen(): bool
    {
        return $this->status === self::STATUS_OPEN;
    }

    public function isClosed(): bool
    {
        return $this->status === self::STATUS_CLOSED;
    }

    public function scopeMonths(Builder $query): Builder
    {
        return $query->where('period_type', self::TYPE_MONTH);
    }

    public function scopeOfDate(Builder $query, string $date): Builder
    {
        return $query->months()
            ->whereDate('start_date', '<=', $date)
            ->whereDate('end_date', '>=', $date);
    }
}
