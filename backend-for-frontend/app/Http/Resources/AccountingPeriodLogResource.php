<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccountingPeriodLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'accounting_period_id' => $this->accounting_period_id,
            'action' => $this->action,
            'performed_by' => $this->performed_by,
            'performed_at' => $this->performed_at?->toIso8601String(),
            'reason' => $this->reason,
            'snapshot_run_id' => $this->snapshot_run_id,
            'snapshot' => $this->whenLoaded('snapshot', fn () => new TrialBalanceRunResource($this->snapshot)),
        ];
    }
}
