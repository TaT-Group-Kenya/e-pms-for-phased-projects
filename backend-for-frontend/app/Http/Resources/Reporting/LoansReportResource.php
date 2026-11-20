<?php

namespace App\Http\Resources\Reporting;

use Illuminate\Http\Resources\Json\JsonResource;

class LoansReportResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'disbursement_date' => $this->disbursement_date,
            'lender_name' => $this->lender_name,
            'loan_number' => $this->loan->id,
            'currency' => $this->currency,
            'amount_loaned' => (float) $this->principal,
            'total_interest' => (float) $this->total_interest,
            'total_due' => (float) $this->total_due,
            'total_paid' => (float) $this->total_paid,
            'balance' => (float) $this->balance,
            'status' => $this->status,
        ];
    }
}
