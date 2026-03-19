<?php

namespace App\Http\Resources\Reporting;

use Illuminate\Http\Resources\Json\JsonResource;

class ExpenseReportResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id ?? '',
            'amount' => $this->amount ?? 0,
            'tax_amount' => $this->tax_amount ?? 0,
            'net_amount' => $this->net_amount ?? 0,
            'base_currency' => $this->base_currency ?? '',
            'expense' => $this->expense ?? '',
            'category' => $this->category ?? '',
            'cost_center' => $this->cost_center ?? '',
            'created_at' => $this->created_at ?? '',
        ];
    }
}
