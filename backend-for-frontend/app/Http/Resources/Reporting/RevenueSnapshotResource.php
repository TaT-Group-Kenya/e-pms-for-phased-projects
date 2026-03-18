<?php

namespace App\Http\Resources\Reporting;

use Illuminate\Http\Resources\Json\JsonResource;

class RevenueSnapshotResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'total_payments_received' => $this['total_payments_received'],
            'total_invoices_issued' => $this['total_invoices_issued'],
            'outstanding_invoices' => $this['outstanding_invoices'],
            'currency' => $this['currency'],
            'total_refunds' => $this['total_refunds'],
        ];
    }
}
