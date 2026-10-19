<?php

namespace App\Http\Resources;

class AccountResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'description' => $this->description,
            'type' => $this->type,
            'group' => $this->group,
            'currency' => $this->currency,
            'balance' => $this->balance,
            'overdraft_allowed' => $this->overdraft_allowed,
            'chart_of_account_id' => $this->chart_of_account_id,
            'chart_of_account' => $this->whenLoaded('chartOfAccount', function () {
                return $this->chartOfAccount ? [
                    'id' => $this->chartOfAccount->id,
                    'code' => $this->chartOfAccount->code,
                    'name' => $this->chartOfAccount->name,
                ] : null;
            }),
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,

        ];
    }
}
