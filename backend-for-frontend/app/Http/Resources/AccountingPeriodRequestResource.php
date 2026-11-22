<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccountingPeriodRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $viewer = auth()->user();

        return [
            'id' => $this->id,
            'accounting_period_id' => $this->accounting_period_id,
            'action' => $this->action,
            'status' => $this->status,
            'requested_by' => $this->requested_by,
            'requested_at' => $this->requested_at?->toIso8601String(),
            'reason' => $this->reason,
            'forex_rate' => $this->forex_rate !== null ? (float) $this->forex_rate : null,
            'checklist_summary' => $this->checklist_summary,
            'reviewed_by' => $this->reviewed_by,
            'reviewed_at' => $this->reviewed_at?->toIso8601String(),
            'review_note' => $this->review_note,
            'executed_log_id' => $this->executed_log_id,
            'is_own_request' => $viewer !== null && (int) $this->requested_by === (int) $viewer->getAuthIdentifier(),
            'period' => $this->whenLoaded('period', fn () => new AccountingPeriodResource($this->period)),
        ];
    }
}
