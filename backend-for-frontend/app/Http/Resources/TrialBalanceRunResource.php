<?php

namespace App\Http\Resources;

class TrialBalanceRunResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'run_number' => $this->run_number,
            'as_at_date' => $this->as_at_date?->toDateString(),
            'forex_rate' => (float) $this->forex_rate,
            'base_currency' => $this->base_currency,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,
            'is_deleted' => (bool) $this->is_deleted,
        ];
    }
}
