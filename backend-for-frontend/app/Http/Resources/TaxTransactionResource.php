<?php

namespace App\Http\Resources;

class TaxTransactionResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'transaction_number' => $this->transaction_number,
            'tax_id' => $this->tax_id,
            'side' => $this->side,
            'tax' => $this->whenLoaded('tax', function () {
                return $this->tax ? [
                    'id' => $this->tax->id,
                    'code' => $this->tax->code,
                    'name' => $this->tax->name,
                    'rate' => (float) $this->tax->rate,
                ] : null;
            }),
            'direction' => $this->direction,
            'chart_of_account' => $this->chart_of_account,
            'chart_of_account_data' => $this->whenLoaded('chartOfAccount', function () {
                return $this->chartOfAccount ? [
                    'id' => $this->chartOfAccount->id,
                    'code' => $this->chartOfAccount->code,
                    'name' => $this->chartOfAccount->name,
                ] : null;
            }),
            'amount' => (float) $this->amount,
            'transaction_currency' => $this->transaction_currency,
            'exchange_rate' => (float) $this->exchange_rate,
            'converted_amount' => (float) $this->converted_amount,
            'transaction_date' => $this->formatTimestamp($this->transaction_date),
            'posted_date' => $this->formatTimestamp($this->posted_date),
            'customer_id' => $this->customer_id,
            'company_id' => $this->company_id,
            'source_type' => $this->source_type,
            'source_id' => $this->source_id,
            'narration' => $this->narration,
            'created_at' => $this->formatTimestamp($this->created_at),
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'is_deleted' => (bool) $this->is_deleted,
        ];
    }
}
