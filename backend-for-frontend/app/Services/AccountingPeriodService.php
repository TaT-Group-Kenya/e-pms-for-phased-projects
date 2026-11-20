<?php

namespace App\Services;

use App\Exceptions\PeriodCloseNotAllowedException;
use App\Exceptions\PeriodLockedException;
use App\Models\AccountingPeriod;
use App\Models\AccountingPeriodLog;
use App\Models\TrialBalanceRun;
use App\Services\Concerns\PeriodLock;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class AccountingPeriodService
{
    /**
     * Future months are auto-created on period fetch (see ensureCurrentYear),
     * so closing always operates on a complete year grid.
     */
    public function ensureCurrentYear(?int $userId = null): void
    {
        $this->ensureYear(now()->year, $userId);
    }

    /**
     * Materialise the full 12-month grid (plus quarter rows) for a fiscal
     * year if any part of it is missing. Idempotent; used by the period
     * index endpoint so year rollovers never depend on a cron.
     */
    public function ensureYear(int $year, ?int $userId = null): void
    {
        $existingMonthCount = AccountingPeriod::query()
            ->months()
            ->where('fiscal_year', $year)
            ->count();

        if ($existingMonthCount >= 12) {
            return;
        }

        PeriodLock::withoutChecking(function () use ($year, $userId) {
            DB::transaction(function () use ($year, $userId) {
                $this->ensureYearRows($year, $userId);
            });
        });
    }

    protected function ensureYearRows(int $year, ?int $userId = null): void
    {
        $this->firstOrCreate(self::year($year), $userId);

        foreach (range(1, 4) as $quarter) {
            $this->firstOrCreate(self::quarter($year, $quarter), $userId);
        }

        foreach (range(1, 12) as $month) {
            $this->firstOrCreate(self::month($year, $month), $userId);
        }

        // New rows may have been created while months of this year were
        // already closed: refresh the quarter/year rollup statuses.
        $lastMonth = AccountingPeriod::query()
            ->months()->where('fiscal_year', $year)->where('month', 12)->first();
        if ($lastMonth) {
            $this->syncAncestors($lastMonth);
        }
    }

    /**
     * Period row for the month containing $date. Creates the year, quarter
     * and month rows on demand (all open), so posting into a far-future year
     * never fails with a "missing period".
     */
    public function ensureForDate(string|Carbon $date, ?int $userId = null): AccountingPeriod
    {
        try {
            $exists = \Schema::hasTable('accounting_periods');
        } catch (\Throwable) {
            // Minimal test schema without period tables: return a transient
            // open period rather than break financial posting.
            $day = Carbon::parse($date)->startOfDay();

            return new AccountingPeriod([
                'period_type' => AccountingPeriod::TYPE_MONTH,
                'fiscal_year' => $day->year,
                'month' => $day->month,
                'name' => $day->format('M Y'),
                'start_date' => $day->copy()->startOfMonth(),
                'end_date' => $day->copy()->endOfMonth(),
                'status' => AccountingPeriod::STATUS_OPEN,
            ]);
        }

        if (! $exists) {
            $day = Carbon::parse($date)->startOfDay();

            return new AccountingPeriod([
                'period_type' => AccountingPeriod::TYPE_MONTH,
                'fiscal_year' => $day->year,
                'month' => $day->month,
                'name' => $day->format('M Y'),
                'start_date' => $day->copy()->startOfMonth(),
                'end_date' => $day->copy()->endOfMonth(),
                'status' => AccountingPeriod::STATUS_OPEN,
            ]);
        }

        $day = Carbon::parse($date)->startOfDay();
        $year = (int) $day->year;
        $quarter = intdiv($day->month - 1, 3) + 1;
        $month = (int) $day->month;

        return DB::transaction(function () use ($day, $year, $quarter, $month, $userId) {
            $this->firstOrCreate(self::year($year), $userId);
            $this->firstOrCreate(self::quarter($year, $quarter), $userId);
            return $this->firstOrCreate(self::month($year, $month), $userId);
        });
    }

    /**
     * Lock gate: throws PeriodLockedException when $date falls in a closed
     * month. This is the single entry point used by observers, form requests
     * and controllers.
     */
    public function assertOpen(string|Carbon $date, string $context = 'posting'): AccountingPeriod
    {
        $period = $this->ensureForDate($date);
        if ($period->isClosed()) {
            throw new PeriodLockedException(
                sprintf(
                    'Accounting period %s is closed. %s into a closed month is not allowed.',
                    $period->name,
                    ucfirst($context)
                ),
                date: $period->start_date->toDateString(),
                periodId: $period->id,
                periodName: $period->name,
            );
        }

        return $period;
    }

    /**
     * True when the given date sits inside a closed month. Never creates
     * periods; a missing period is treated as open. Missing period tables
     * (minimal test schemas) are also treated as open.
     */
    public function isDateClosed(string|Carbon $date): bool
    {
        try {
            $exists = \Schema::hasTable('accounting_periods');
        } catch (\Throwable) {
            return false;
        }

        if (! $exists) {
            return false;
        }

        $day = Carbon::parse($date)->startOfDay();

        $period = AccountingPeriod::query()
            ->months()
            ->where('fiscal_year', $day->year)
            ->where('month', $day->month)
            ->first();

        return $period !== null && $period->isClosed();
    }

    /**
     * Close a month: flips the status, takes the trial balance snapshot and
     * writes the audit log — all in one transaction so a closed month can
     * never exist without its snapshot.
     *
     * Only fully-ended months may be closed: closing the current or any
     * future month is rejected, because postings can still land there.
     */
    public function closeMonth(AccountingPeriod $period, ?float $forexRate, int $userId): AccountingPeriod
    {
        if ($period->period_type !== AccountingPeriod::TYPE_MONTH) {
            throw new PeriodLockedException('Only month periods can be closed at this time.');
        }

        if ($this->isCurrentOrFutureMonth($period)) {
            throw new PeriodCloseNotAllowedException(
                sprintf(
                    'Only past months can be closed. %s has not fully ended yet.',
                    $period->name,
                ),
            );
        }

        if ($period->isClosed()) {
            return $period; // idempotent
        }

        return DB::transaction(function () use ($period, $forexRate, $userId) {
            $period->refresh();
            if ($period->isClosed()) {
                return $period;
            }

            $snapshot = app(TrialBalanceService::class)->generate([
                'as_at_date' => $period->end_date->toDateString(),
                'forex_rate' => $forexRate ?? (float) config('accounting_periods.snapshot_forex_rate_fallback', 1),
                'created_by' => $userId,
            ]);

            $snapshot->forceFill([
                'trigger' => 'period_close',
                'accounting_period_id' => $period->id,
            ])->save();

            $now = now();
            $period->forceFill([
                'status' => AccountingPeriod::STATUS_CLOSED,
                'closed_at' => $now,
                'closed_by' => $userId,
                'closed_at_snapshot' => $now,
                'updated_by' => $userId,
            ])->save();

            AccountingPeriodLog::create([
                'accounting_period_id' => $period->id,
                'action' => AccountingPeriodLog::ACTION_CLOSED,
                'performed_by' => $userId,
                'performed_at' => $now,
                'reason' => null,
                'snapshot_run_id' => $snapshot->id,
            ]);

            $this->syncAncestors($period);

            return $period;
        });
    }

    /**
     * Close a quarter or year: closes every open descendant month in one
     * transaction. Kept for future use (UI currently exposes months only).
     */
    public function closeHierarchy(AccountingPeriod $period, ?float $forexRate, int $userId): int
    {
        if ($period->period_type === AccountingPeriod::TYPE_MONTH) {
            $this->closeMonth($period, $forexRate, $userId);

            return 1;
        }

        return DB::transaction(function () use ($period, $forexRate, $userId) {
            $months = $this->descendantMonths($period);
            $closed = 0;
            foreach ($months as $month) {
                if ($month->isOpen()) {
                    $this->closeMonth($month, $forexRate, $userId);
                    $closed++;
                }
            }

            return $closed;
        });
    }

    /**
     * True when the month is the in-progress current month or any later
     * month (i.e. it has not completely ended yet) and must stay open.
     */
    public function isCurrentOrFutureMonth(AccountingPeriod $period): bool
    {
        if ($period->period_type !== AccountingPeriod::TYPE_MONTH) {
            return false;
        }

        $now = now();

        return $period->fiscal_year > $now->year
            || ($period->fiscal_year === (int) $now->year
                && (int) $period->month >= (int) $now->month);
    }

    /**
     * Reopen a closed month. Administrator-only (policy enforced upstream);
     * requires a mandatory reason which is stored on the audit trail.
     */
    public function reopen(AccountingPeriod $period, string $reason, int $userId): AccountingPeriod
    {
        if (! $period->isClosed()) {
            return $period; // idempotent
        }

        $reason = trim($reason);
        if ($reason === '') {
            throw new PeriodLockedException('A reason is required to reopen a closed accounting period.');
        }

        return DB::transaction(function () use ($period, $reason, $userId) {
            $now = now();
            $period->forceFill([
                'status' => AccountingPeriod::STATUS_OPEN,
                'reopened_at' => $now,
                'reopened_by' => $userId,
                'last_reopen_reason' => $reason,
                'updated_by' => $userId,
            ])->save();

            AccountingPeriodLog::create([
                'accounting_period_id' => $period->id,
                'action' => AccountingPeriodLog::ACTION_REOPENED,
                'performed_by' => $userId,
                'performed_at' => $now,
                'reason' => $reason,
                'snapshot_run_id' => null,
            ]);

            $this->syncAncestors($period);

            return $period;
        });
    }

    /**
     * Draft/unfinished financial documents dated in a (to-be) closed month
     * that will become un-editable — a non-blocking review aid.
     */
    public function strandedDrafts(AccountingPeriod $period, int $limit = 50): array
    {
        if ($period->period_type !== AccountingPeriod::TYPE_MONTH) {
            return [];
        }

        $start = $period->start_date->toDateString();
        $end = $period->end_date->toDateString();
        $results = [];

        $draftSpecs = [
            ['table' => 'quotations', 'label' => 'Quotations', 'statusCols' => ['status'], 'draft' => ['draft']],
            ['table' => 'orders', 'label' => 'Orders', 'statusCols' => ['status'], 'draft' => ['draft', 'pending']],
            ['table' => 'cust_invoices', 'label' => 'Customer invoices', 'statusCols' => ['status'], 'draft' => ['draft']],
            ['table' => 'company_invoices', 'label' => 'Service provider invoices', 'statusCols' => ['status'], 'draft' => ['draft']],
            ['table' => 'office_expenses', 'label' => 'Office expenses', 'statusCols' => ['status'], 'draft' => ['pending']],
        ];

        foreach ($draftSpecs as $spec) {
            if (! \Schema::hasTable($spec['table'])) {
                continue;
            }
            $query = \DB::table($spec['table'])
                ->whereBetween($this->dateColumn($spec['table']), [$start, $end])
                ->where(function ($q) use ($spec) {
                    $q->where('is_deleted', 0)->orWhereNull('is_deleted');
                });
            $query->whereIn('status', $spec['draft']);
            $count = (clone $query)->count();

            if ($count > 0) {
                $rows = $query->limit($limit)->get();
                $results[] = [
                    'label' => $spec['label'],
                    'count' => $count,
                    'items' => $rows->map(fn ($r) => [
                        'id' => (int) $r->id,
                        'title' => $r->title
                            ?? $r->quotation_number
                            ?? $r->invoice_number
                            ?? $r->order_number
                            ?? ('#'.$r->id),
                    ])->all(),
                ];
            }
        }

        return $results;
    }

    /**
     * Open/closed period map for the frontend. Auto-materialises the full
     * current-year grid first (year rollover protection, no cron needed) —
     * fetching periods for "now" is the de-facto year bootstrap hook.
     */
    public function monthStatuses(int $year): array
    {
        if ($year === (int) now()->year) {
            $this->ensureCurrentYear();
        }

        $months = AccountingPeriod::query()
            ->months()
            ->where('fiscal_year', $year)
            ->orderBy('month')
            ->get();

        return $months
            ->map(fn (AccountingPeriod $p) => [
                'id' => $p->id,
                'month' => $p->month,
                'name' => $p->name,
                'status' => $p->status,
                'closable' => ! $this->isCurrentOrFutureMonth($p) && $p->isOpen(),
                'start_date' => $p->start_date->toDateString(),
                'end_date' => $p->end_date->toDateString(),
                'closed_at' => $p->closed_at?->toIso8601String(),
                'closed_by' => $p->closed_by,
                'reopened_at' => $p->reopened_at?->toIso8601String(),
                'reopened_by' => $p->reopened_by,
                'last_reopen_reason' => $p->last_reopen_reason,
            ])
            ->all();
    }

    /**
     * Close ancestor statuses when months change (derived, always consistent).
     */
    public function syncAncestors(AccountingPeriod $month): void
    {
        if ($month->period_type !== AccountingPeriod::TYPE_MONTH) {
            return;
        }

        $year = $month->fiscal_year;
        $quarter = (intdiv($month->month - 1, 3) + 1);

        $quarterMonths = AccountingPeriod::query()
            ->months()->where('fiscal_year', $year)
            ->whereBetween('month', [($quarter - 1) * 3 + 1, $quarter * 3])
            ->get();
        $this->syncAncestorRow(
            self::quarter($year, $quarter),
            $quarterMonths,
        );

        $yearMonths = AccountingPeriod::query()
            ->months()->where('fiscal_year', $year)->get();
        $this->syncAncestorRow(
            self::year($year),
            $yearMonths,
        );
    }

    private function syncAncestorRow(array $key, $children): void
    {
        $ancestor = AccountingPeriod::query()
            ->where('period_type', $key['period_type'])
            ->where('fiscal_year', $key['fiscal_year'])
            ->when($key['period_type'] === AccountingPeriod::TYPE_QUARTER, fn ($q) => $q->where('quarter', $key['quarter']))
            ->first();

        if (! $ancestor) {
            return;
        }

        $allClosed = $children->isNotEmpty() && $children->every(fn ($c) => $c->isClosed());
        $next = $allClosed ? AccountingPeriod::STATUS_CLOSED : AccountingPeriod::STATUS_OPEN;

        if ($ancestor->status !== $next) {
            $ancestor->forceFill(['status' => $next])->save();
        }
    }

    public function descendantMonths(AccountingPeriod $period): \Illuminate\Support\Collection
    {
        if ($period->period_type === AccountingPeriod::TYPE_MONTH) {
            return collect([$period]);
        }

        return AccountingPeriod::query()->months()
            ->when(
                $period->period_type === AccountingPeriod::TYPE_QUARTER,
                fn ($q) => $q->where('fiscal_year', $period->fiscal_year)
                    ->whereBetween('month', [($period->quarter - 1) * 3 + 1, $period->quarter * 3]),
                fn ($q) => $q->where('fiscal_year', $period->fiscal_year),
            )
            ->orderBy('month')
            ->get();
    }

    private function dateColumn(string $table): string
    {
        return in_array($table, ['quotations', 'orders', 'cust_invoices', 'company_invoices', 'office_expenses'], true)
            ? 'created_at'
            : $this->tableDateColumns()[$table] ?? 'created_at';
    }

    private function tableDateColumns(): array
    {
        return [
            'quotations' => 'created_at',
            'orders' => 'created_at',
            'cust_invoices' => 'created_at',
            'company_invoices' => 'created_at',
            'office_expenses' => 'date',
        ];
    }

    private function firstOrCreate(array $key, ?int $userId): AccountingPeriod
    {
        $query = AccountingPeriod::query()
            ->where('period_type', $key['period_type'])
            ->where('fiscal_year', $key['fiscal_year']);

        if ($key['period_type'] === AccountingPeriod::TYPE_QUARTER) {
            $query->where('quarter', $key['quarter']);
        }
        if ($key['period_type'] === AccountingPeriod::TYPE_MONTH) {
            $query->where('month', $key['month']);
        }

        $existing = $query->first();

        return $existing ?? $this->buildPeriod($key, $userId);
    }

    private function buildPeriod(array $key, ?int $userId): AccountingPeriod
    {
        return match ($key['period_type']) {
            AccountingPeriod::TYPE_YEAR => AccountingPeriod::create([
                'period_type' => AccountingPeriod::TYPE_YEAR,
                'fiscal_year' => $key['fiscal_year'],
                'quarter' => null,
                'month' => null,
                'status' => AccountingPeriod::STATUS_OPEN,
                'created_by' => $userId,
                'updated_by' => $userId,
            ] + self::windowForYear($key['fiscal_year']) + self::nameForYear($key['fiscal_year'])),
            AccountingPeriod::TYPE_QUARTER => AccountingPeriod::create([
                'period_type' => AccountingPeriod::TYPE_QUARTER,
                'fiscal_year' => $key['fiscal_year'],
                'quarter' => $key['quarter'],
                'month' => null,
                'status' => AccountingPeriod::STATUS_OPEN,
                'created_by' => $userId,
                'updated_by' => $userId,
            ] + self::windowForQuarter($key['fiscal_year'], $key['quarter']) + self::nameForQuarter($key['fiscal_year'], $key['quarter'])),
            AccountingPeriod::TYPE_MONTH => AccountingPeriod::create([
                'period_type' => AccountingPeriod::TYPE_MONTH,
                'fiscal_year' => $key['fiscal_year'],
                'quarter' => intdiv($key['month'] - 1, 3) + 1,
                'month' => $key['month'],
                'status' => AccountingPeriod::STATUS_OPEN,
                'created_by' => $userId,
                'updated_by' => $userId,
            ] + self::windowForMonth($key['fiscal_year'], $key['month']) + self::nameForMonth($key['fiscal_year'], $key['month'])),
        };
    }

    public static function year(int $year): array
    {
        return ['period_type' => AccountingPeriod::TYPE_YEAR, 'fiscal_year' => $year, 'quarter' => null, 'month' => null];
    }

    public static function quarter(int $year, int $quarter): array
    {
        return ['period_type' => AccountingPeriod::TYPE_QUARTER, 'fiscal_year' => $year, 'quarter' => $quarter, 'month' => null];
    }

    public static function month(int $year, int $month): array
    {
        return ['period_type' => AccountingPeriod::TYPE_MONTH, 'fiscal_year' => $year, 'quarter' => intdiv($month - 1, 3) + 1, 'month' => $month];
    }

    private static function windowForYear(int $year): array
    {
        return ['start_date' => "$year-01-01", 'end_date' => "$year-12-31"];
    }

    private static function windowForQuarter(int $year, int $quarter): array
    {
        $startMonth = ($quarter - 1) * 3 + 1;
        $endMonth = $quarter * 3;

        return [
            'start_date' => Carbon::create($year, $startMonth, 1)->toDateString(),
            'end_date' => Carbon::create($year, $endMonth, 1)->endOfMonth()->toDateString(),
        ];
    }

    private static function windowForMonth(int $year, int $month): array
    {
        return [
            'start_date' => Carbon::create($year, $month, 1)->toDateString(),
            'end_date' => Carbon::create($year, $month, 1)->endOfMonth()->toDateString(),
        ];
    }

    private static function nameForYear(int $year): array
    {
        return ['name' => "FY $year"];
    }

    private static function nameForQuarter(int $year, int $quarter): array
    {
        return ['name' => sprintf('Q%d %d', $quarter, $year)];
    }

    private static function nameForMonth(int $year, int $month): array
    {
        return ['name' => Carbon::create($year, $month, 1)->format('M Y')];
    }
}
