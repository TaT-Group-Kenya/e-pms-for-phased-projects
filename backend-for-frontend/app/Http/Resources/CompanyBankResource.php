<?php

namespace App\Http\Resources;

class CompanyBankResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'company_id' => $this->company_id,
            'type' => $this->type,
            'account_no' => $this->account_no,
            'swiftcode' => $this->swiftcode,
            'branch' => $this->branch,
            'account_holder_name' => $this->account_holder_name,
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,

        ];
    }
}
