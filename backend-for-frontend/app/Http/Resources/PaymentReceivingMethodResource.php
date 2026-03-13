<?php

namespace App\Http\Resources;

class PaymentReceivingMethodResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'name' => $this->name,
            'currency' => $this->currency,
            'instruction' => $this->instruction,
            'paybill' => $this->paybill,
            'account_holder_name' => $this->account_holder_name,
            'account_number' => $this->account_number,
            'bank' => $this->bank,
            'branch' => $this->branch,
            'swift_code' => $this->swift_code,
            'iban' => $this->iban,
            'status' => $this->status,
            'is_deleted' => (bool) $this->is_deleted,
            'deleted_at' => $this->formatTimestamp($this->deleted_at),
            'deleted_by' => $this->deleted_by,
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,
        ];
    }
}
