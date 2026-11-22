<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AccountingPeriodLogResource;
use App\Http\Resources\AccountingPeriodRequestResource;
use App\Http\Resources\AccountingPeriodResource;
use App\Models\AccountingPeriod;
use App\Models\AccountingPeriodLog;
use App\Models\AccountingPeriodRequest;
use App\Policies\AccountingPeriodPolicy;
use App\Services\AccountingPeriodService;
use App\Services\TrialBalanceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

/**
 * Accounting periods (year / quarter / month) with maker/checker governed
 * close & reopen plus the audit trail. Months are the operational lock
 * unit; only fully-ended months may be closed.
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
        $months = $this->periods->monthStatuses($year);
        $userId = (int) Auth::id();

        // Most recent close/reopen request per month, so the UI can badge
        // cards with Pending approved / Rejected states. A PENDING request
        // always wins over older approved/rejected ones for the same period
        // (the user's error message for a duplicate submit says "already
        // pending", so the card must show that pending request — not just a
        // historical rejected one).
        $requestsByPeriod = AccountingPeriodRequest::query()
            ->whereIn('accounting_period_id', collect($months)->pluck('id'))
            ->whereIn('status', [
                AccountingPeriodRequest::STATUS_PENDING,
                AccountingPeriodRequest::STATUS_APPROVED,
                AccountingPeriodRequest::STATUS_REJECTED,
            ])
            ->orderByDesc('id')
            ->get()
            ->groupBy('accounting_period_id')
            ->map(fn ($group) => $group->first(fn ($r) => $r->status === AccountingPeriodRequest::STATUS_PENDING)
                ?? $group->first());

        $months = array_map(function ($month) use ($requestsByPeriod, $userId) {
            $latest = $requestsByPeriod->get($month['id']);

            $month['latest_request'] = $latest ? [
                'id' => $latest->id,
                'action' => $latest->action,
                'status' => $latest->status,
                'requested_by' => $latest->requested_by,
                'requested_at' => $latest->requested_at?->toIso8601String(),
                'reviewed_by' => $latest->reviewed_by,
                'reviewed_at' => $latest->reviewed_at?->toIso8601String(),
                'review_note' => $latest->review_note,
                'is_own_request' => $userId > 0 && (int) $latest->requested_by === $userId,
            ] : null;

            return $month;
        }, $months);

        return response()->json([
            'fiscal_year' => $year,
            'maker_checker' => [
                'can_make' => Auth::user() ? Gate::forUser(Auth::user())->allows('make', AccountingPeriod::class) : false,
                'can_check' => Auth::user() ? Gate::forUser(Auth::user())->allows('review', AccountingPeriodRequest::class) : false,
            ],
            'months' => $months,
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

    /**
     * MAKER: submit a close request. Executed only once a checker approves.
     */
    public function close(Request $request, AccountingPeriod $accountingPeriod): JsonResponse
    {
        $this->authorize('make', AccountingPeriod::class);

        $validated = $request->validate([
            'forex_rate' => ['required', 'numeric', 'min:0.000001'],
            'note' => ['nullable', 'string', 'max:1000'],
        ]);

        try {
            $submission = $this->periods->submitRequest(
                $accountingPeriod,
                AccountingPeriodRequest::ACTION_CLOSE,
                (int) Auth::id(),
                [
                    'forex_rate' => (float) $validated['forex_rate'],
                    'reason' => $validated['note'] ?? null,
                ],
            );
        } catch (\App\Exceptions\PeriodCloseNotAllowedException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'error' => 'PeriodNotCloseable',
            ], 422);
        } catch (\App\Exceptions\PeriodLockedException $e) {
            return response()->json(['message' => trim($e->getMessage())], 423);
        }

        return response()->json([
            'message' => 'Close request submitted. A checker must approve it before the month is locked.',
            'data' => new AccountingPeriodRequestResource($submission->loadMissing('period')),
        ], 202);
    }

    /**
     * MAKER: submit a reopen request (reason required).
     */
    public function reopen(Request $request, AccountingPeriod $accountingPeriod): JsonResponse
    {
        $this->authorize('make', AccountingPeriod::class);

        $validated = $request->validate([
            'reason' => ['required', 'string', 'min:3'],
        ]);

        try {
            $submission = $this->periods->submitRequest(
                $accountingPeriod,
                AccountingPeriodRequest::ACTION_REOPEN,
                (int) Auth::id(),
                ['reason' => (string) $validated['reason']],
            );
        } catch (\App\Exceptions\PeriodLockedException $e) {
            return response()->json(['message' => trim($e->getMessage())], 423);
        }

        return response()->json([
            'message' => 'Reopen request submitted. A checker must approve it before the month is unlocked.',
            'data' => new AccountingPeriodRequestResource($submission->loadMissing('period')),
        ], 202);
    }

    /**
     * Request queue: pending first; makers see their own, checkers see all.
     */
    public function requests(Request $request): JsonResponse
    {
        $this->authorize('viewRequests', AccountingPeriod::class);

        $status = $request->get('status');
        $userId = (int) Auth::id();
        $isChecker = (bool) Gate::allows('review', AccountingPeriodRequest::class);

        $query = AccountingPeriodRequest::query()
            ->with(['period'])
            ->when($status && $status !== 'all', fn ($q) => $q->where('status', $status))
            // Makers see only their own submissions; checkers see everything.
            ->when(! $isChecker, fn ($q) => $q->where('requested_by', $userId));

        $requests = $query->orderByRaw("CASE status WHEN 'pending' THEN 0 ELSE 1 END")
            ->orderByDesc('id')
            ->limit((int) $request->get('per_page', 50))
            ->get();

        return response()->json([
            'data' => AccountingPeriodRequestResource::collection($requests),
            'is_checker' => $isChecker,
        ]);
    }

    /**
     * CHECKER: approve a pending request; executes close (with snapshot)
     * or reopen atomically. Maker ≠ checker enforced in the service.
     */
    public function approve(Request $request, AccountingPeriodRequest $accountingPeriodRequest): JsonResponse
    {
        $this->authorize('review', $accountingPeriodRequest);

        $validated = $request->validate([
            'review_note' => ['nullable', 'string', 'max:1000'],
        ]);

        try {
            $approved = $this->periods->approveRequest(
                $accountingPeriodRequest,
                (int) Auth::id(),
                $validated['review_note'] ?? null,
            );
        } catch (\App\Exceptions\PeriodLockedException $e) {
            return response()->json(['message' => trim($e->getMessage())], 423);
        } catch (\App\Exceptions\PeriodCloseNotAllowedException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'error' => 'PeriodNotCloseable',
            ], 422);
        }

        return response()->json([
            'message' => 'Request approved and executed.',
            'data' => new AccountingPeriodRequestResource($approved->loadMissing('period')),
        ]);
    }

    /**
     * CHECKER: reject a pending request (review note mandatory).
     */
    public function reject(Request $request, AccountingPeriodRequest $accountingPeriodRequest): JsonResponse
    {
        $this->authorize('review', $accountingPeriodRequest);

        $validated = $request->validate([
            'review_note' => ['required', 'string', 'min:3'],
        ]);

        try {
            $rejected = $this->periods->rejectRequest(
                $accountingPeriodRequest,
                (int) Auth::id(),
                (string) $validated['review_note'],
            );
        } catch (\App\Exceptions\PeriodLockedException $e) {
            return response()->json(['message' => trim($e->getMessage())], 423);
        }

        return response()->json([
            'message' => 'Request rejected.',
            'data' => new AccountingPeriodRequestResource($rejected->loadMissing('period')),
        ]);
    }

    /**
     * MAKER: cancel their own still-pending request.
     */
    public function cancel(Request $request, AccountingPeriodRequest $accountingPeriodRequest): JsonResponse
    {
        $this->authorize('cancel', $accountingPeriodRequest);

        try {
            $cancelled = $this->periods->cancelRequest($accountingPeriodRequest, (int) Auth::id());
        } catch (\App\Exceptions\PeriodLockedException $e) {
            return response()->json(['message' => trim($e->getMessage())], 423);
        }

        return response()->json([
            'message' => 'Request cancelled.',
            'data' => new AccountingPeriodRequestResource($cancelled->loadMissing('period')),
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
