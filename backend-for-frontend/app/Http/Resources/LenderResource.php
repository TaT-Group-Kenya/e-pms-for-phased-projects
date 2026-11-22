<?php

namespace App\Http\Resources;

class LenderResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'address' => $this->address,
            'email' => $this->email,
            'phone' => $this->phone,
            'kra_pin' => $this->kra_pin,
            'loans' => $this->whenLoaded('loans', function () {
                return $this->loans->map(fn ($loan) => [
                    'id' => $loan->id,
                    'principal' => (float) $loan->principal,
                    'currency' => $loan->currency,
                    'status' => $loan->status,
                ]);
            }),
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
