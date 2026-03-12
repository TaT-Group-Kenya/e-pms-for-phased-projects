<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OfficeExpenseResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'category' => $this->category,
            'costCenter' => $this->costCenter,
            'description' => $this->description,
            'amount' => (float) $this->amount,
            'currency' => $this->currency,
            'date' => $this->date,
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'status' => $this->status,
            'payments' => OfficeExpensePaymentResource::collection($this->whenLoaded('payments', function () {
                return $this->payments;
            }, $this->payments ?? [])),
        ];
    }
}
