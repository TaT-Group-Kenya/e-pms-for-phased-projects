<?php

namespace App\Http\Controllers\Api\Concerns;

use App\Services\AccountingPeriodService;
use App\Services\Concerns\PeriodLock;
use Illuminate\Http\JsonResponse;

/**
 * Explicit period-lock checks for financial write endpoints.
 *
 * The observer layer (PeriodLock) is a safety net; these checks give the
 * caller clean 423 responses with structured errors at the API surface.
 */
trait EnsuresOpenPeriod
{
    /**
     * Bail out with a 423 when $date falls in a closed accounting month.
     */
    protected function ensurePeriodOpenForDate($date, string $field = 'date'): ?JsonResponse
    {
        if ($date === null || $date === '') {
            return null;
        }

        try {
            app(AccountingPeriodService::class)->assertOpen($date, 'posting');
        } catch (\App\Exceptions\PeriodLockedException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'error' => 'PeriodLocked',
                'errors' => [
                    $field => [$e->getMessage()],
                ],
                'period' => [
                    'date' => $e->date,
                    'id' => $e->periodId,
                    'name' => $e->periodName,
                ],
            ], 423);
        }

        return null;
    }

    /**
     * Bail out with a 423 when the model's stored business date lies in a
     * closed month (edit/delete of an existing document).
     */
    protected function ensureModelPeriodOpen($model): ?JsonResponse
    {
        try {
            PeriodLock::assertModelOpen($model, null, 'change');
        } catch (\App\Exceptions\PeriodLockedException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'error' => 'PeriodLocked',
                'period' => [
                    'date' => $e->date,
                    'id' => $e->periodId,
                    'name' => $e->periodName,
                ],
            ], 423);
        }

        return null;
    }
}
