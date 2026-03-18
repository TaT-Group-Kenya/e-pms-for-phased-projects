<?php

namespace App\Http\Resources\Reporting;

use Illuminate\Http\Resources\Json\JsonResource;

class GeneralLedgerResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'forex' => $this['forex'],
            'totals' => $this['totals'],
            'receivables' => collect($this['receivables'])->map(function($item) {
                return [
                    'payment_id' => $item->id,
                    'customer_id' => $item->customer_id,
                    'project_id' => $item->project_id,
                    'amount' => $item->amount,
                    'currency' => $item->currency,
                    'amount_kes' => $item->amount_kes,
                    'tax_amount' => $item->tax_amount,
                    'net_amount' => $item->net_amount,
                    'created_at' => $item->created_at,
                ];
            }),
            'payables' => collect($this['payables'])->map(function($item) {
                return [
                    'payment_id' => $item->id,
                    'company_id' => $item->company_id,
                    'project_id' => $item->project_id,
                    'amount' => $item->amount,
                    'currency' => $item->currency,
                    'tax_amount' => $item->tax_amount,
                    'net_amount' => $item->net_amount,
                    'created_at' => $item->created_at,
                ];
            }),
        ];
    }
}
