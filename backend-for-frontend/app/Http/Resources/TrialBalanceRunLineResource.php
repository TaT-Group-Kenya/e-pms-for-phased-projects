<?php

namespace App\Http\Resources;

class TrialBalanceRunLineResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'trial_balance_run_id' => $this->trial_balance_run_id,
            'chart_of_account' => $this->chart_of_account,
            'category' => $this->category,
            'source_table' => $this->source_table,
            'source_type' => $this->source_type,
            'source_id' => $this->source_id,
            'account_id' => $this->account_id,
            'debit_kes' => (float) $this->debit_kes,
            'credit_kes' => (float) $this->credit_kes,
            'debit_usd' => (float) $this->debit_usd,
            'credit_usd' => (float) $this->credit_usd,
            'description' => $this->description,
            'created_at' => $this->formatTimestamp($this->created_at),
        ];
    }
}
