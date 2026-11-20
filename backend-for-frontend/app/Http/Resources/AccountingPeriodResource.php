<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccountingPeriodResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'period_type' => $this->period_type,
            'fiscal_year' => $this->fiscal_year,
            'quarter' => $this->quarter,
            'month' => $this->month,
            'name' => $this->name,
            'start_date' => $this->start_date?->toDateString(),
            'end_date' => $this->end_date?->toDateString(),
            'status' => $this->status,
            'closed_at' => $this->closed_at?->toIso8601String(),
            'closed_by' => $this->closed_by,
            'reopened_at' => $this->reopened_at?->toIso8601String(),
            'reopened_by' => $this->reopened_by,
            'last_reopen_reason' => $this->last_reopen_reason,
            'snapshots' => $this->whenLoaded('snapshots', fn () => TrialBalanceRunResource::collection($this->snapshots)),
        ];
    }
}
