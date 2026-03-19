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
                    'transaction_number' => $item->transaction_number,
                    'customer_id' => $item->customer_id,
                    'customer_name' => $item->customer_name ?? null,
                    'project_id' => $item->project_id,
                    'project_name' => $item->project_name ?? null,
                    'currency' => $item->currency,
                    'amount' => $item->amount_paid,
                    'tax_amount' => $item->tax_amount,
                    'net_amount' => $item->net_amount,
                    'amount_kes' => $item->amount_kes,
                    'tax_amount_kes' => $item->tax_amount_kes,
                    'net_amount_kes' => $item->net_amount_kes,
                    'created_at' => $item->created_at,
                ];
            }),
            'payables' => collect($this['payables'])->map(function($item) {
                return [
                    'payment_id' => $item->id,
                    'transaction_number' => $item->transaction_number,
                    'company_id' => $item->company_id,
                    'company_name' => $item->company_name ?? null,
                    'project_id' => $item->project_id,
                    'project_name' => $item->project_name ?? null,
                    'amount' => $item->amount_paid,
                    'currency' => $item->currency,
                    'tax_amount' => $item->tax_amount,
                    'net_amount' => $item->net_amount,
                    'amount_kes' => $item->amount_paid,
                    'tax_amount_kes' => $item->tax_amount,
                    'net_amount_kes' => $item->net_amount,
                    'created_at' => $item->created_at,
                ];
            }),
        ];
    }
}
