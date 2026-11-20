<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AccountingPeriodLogResource;
use App\Http\Resources\AccountingPeriodResource;
use App\Models\AccountingPeriod;
use App\Models\AccountingPeriodLog;
use App\Policies\AccountingPeriodPolicy;
use App\Services\AccountingPeriodService;
use App\Services\TrialBalanceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

/**
 * Accounting periods (year / quarter / month) with close / reopen and the
 * audit trail. Months are the operational lock unit.
 */
class AccountingPeriodController extends Controller
{
    public function __construct(
        protected AccountingPeriodService $periods,
        protected TrialBalanceService $trialBalance,
    ) {}

    /**
     * Month grid for a fiscal year (all three levels exist; months drive UX).
     * Fetching the current year auto-materialises its 12 months, so year
     * rollovers bootstrap themselves without a cron.
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', AccountingPeriod::class);

        $year = (int) ($request->get('fiscal_year', now()->year));

        return response()->json([
            'fiscal_year' => $year,
            'months' => $this->periods->monthStatuses($year),
        ]);
    }

    public function show(AccountingPeriod $accountingPeriod): JsonResponse
    {
        $this->authorize('view', $accountingPeriod);

        return response()->json(new AccountingPeriodResource(
            $accountingPeriod->loadMissing('snapshots')
        ));
    }

    /**
     * Closing checklist preview: what is stranded in the month, the FX rate
     * the snapshot will use, and the period identity itself.
     */
    public function checklist(Request $request, AccountingPeriod $accountingPeriod): JsonResponse
    {
        $this->authorize('close', $accountingPeriod);

        $lastRun = \App\Models\TrialBalanceRun::query()->orderByDesc('id')->first();

        return response()->json([
            'period' => new AccountingPeriodResource($accountingPeriod),
            'suggested_forex_rate' => (float) ($lastRun?->forex_rate ?? 1),
            'stranded_drafts' => $this->periods->strandedDrafts($accountingPeriod),
        ]);
    }

    public function close(Request $request, AccountingPeriod $accountingPeriod): JsonResponse
    {
        $this->authorize('close', $accountingPeriod);

        $validated = $request->validate([
            'forex_rate' => ['required', 'numeric', 'min:0.000001'],
        ]);

        try {
            $closed = $this->periods->closeMonth(
                $accountingPeriod,
                (float) $validated['forex_rate'],
                (int) Auth::id(),
            );
        } catch (\App\Exceptions\PeriodLockedException $e) {
            return response()->json(['message' => $e->getMessage()], 423);
        } catch (\App\Exceptions\PeriodCloseNotAllowedException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'error' => 'PeriodNotCloseable',
            ], 422);
        } catch (\Throwable $e) {
            throw $e;
        }

        return response()->json([
            'message' => 'Accounting period closed. A trial balance snapshot was recorded.',
            'data' => new AccountingPeriodResource($closed->fresh()),
        ]);
    }

    public function reopen(Request $request, AccountingPeriod $accountingPeriod): JsonResponse
    {
        $this->authorize('reopen', $accountingPeriod);

        $validated = $request->validate([
            'reason' => ['required', 'string', 'min:3'],
        ]);

        try {
            $reopened = $this->periods->reopen(
                $accountingPeriod,
                (string) $validated['reason'],
                (int) Auth::id(),
            );
        } catch (\App\Exceptions\PeriodLockedException $e) {
            return response()->json(['message' => $e->getMessage()], 423);
        }

        return response()->json([
            'message' => 'Accounting period reopened. The reason was recorded in the audit trail.',
            'data' => new AccountingPeriodResource($reopened->fresh()),
        ]);
    }

    /**
     * Full audit trail for a period (closes, reopens, snapshot links).
     */
    public function logs(Request $request, AccountingPeriod $accountingPeriod): JsonResponse
    {
        $this->authorize('viewAny', AccountingPeriod::class);

        $logs = AccountingPeriodLog::query()
            ->where('accounting_period_id', $accountingPeriod->id)
            ->with('snapshot')
            ->orderByDesc('performed_at')
            ->orderByDesc('id')
            ->get();

        return response()->json([
            'data' => AccountingPeriodLogResource::collection($logs),
        ]);
    }
}
