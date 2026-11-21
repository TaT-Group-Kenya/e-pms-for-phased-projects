<?php

namespace App\Http\Resources;

use Illuminate\Support\Facades\DB;

class TaxTransactionResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'transaction_number' => $this->transaction_number,
            'tax_id' => $this->tax_id,
            'side' => $this->side,
            'direction' => $this->direction,
            'entry_type' => $this->entry_type,
            'chart_of_account' => $this->chart_of_account,
            'chart' => $this->whenLoaded('chartOfAccount', function () {
                return $this->chartOfAccount ? [
                    'id' => $this->chartOfAccount->id,
                    'code' => $this->chartOfAccount->code,
                    'name' => $this->chartOfAccount->name,
                ] : null;
            }),
            'tax' => $this->whenLoaded('tax', function () {
                return $this->tax ? [
                    'id' => $this->tax->id,
                    'code' => $this->tax->code,
                    'name' => $this->tax->name,
                    'rate' => (float) $this->tax->rate,
                ] : null;
            }),
            'amount' => (float) $this->amount,
            'transaction_currency' => $this->transaction_currency,
            'exchange_rate' => (float) $this->exchange_rate,
            'converted_amount' => (float) $this->converted_amount,
            'running_balance' => $this->running_balance !== null ? (float) $this->running_balance : null,
            'transaction_date' => $this->transaction_date,
            'posted_date' => $this->formatTimestamp($this->posted_date),
            'customer_id' => $this->customer_id,
            'company_id' => $this->company_id,
            'supplier_or_customer' => $this->supplier_or_customer,
            'supplier_or_customer_type' => $this->partyType(),
            'supplier_or_customer_name' => $this->partyName(),
            'kra_pin' => $this->kra_pin,
            'source_type' => $this->source_type,
            'source_id' => $this->source_id,
            'source_document' => $this->sourceDocument(),
            'narration' => $this->narration,
            'created_at' => $this->formatTimestamp($this->created_at),
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'is_deleted' => (bool) $this->is_deleted,
        ];
    }

    protected function partyType(): ?string
    {
        return match (true) {
            (bool) $this->company_id => 'company',
            (bool) $this->customer_id => 'customer',
            default => null,
        };
    }

    protected function partyName(): ?string
    {
        if ($this->supplier_or_customer === null) {
            return null;
        }

        try {
            $table = $this->partyType() === 'company' ? 'companies' : 'customers';

            return DB::table($table)
                ->where('id', $this->supplier_or_customer)
                ->value('name');
        } catch (\Throwable) {
            return null;
        }
    }
}
