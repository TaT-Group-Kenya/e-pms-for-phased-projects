<?php

namespace App\Http\Resources;

class LoanResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'destination_account_id' => $this->account_id,
            'destination_account' => $this->whenLoaded('destination', function () {
                return $this->destination ? [
                    'id' => $this->destination->id,
                    'code' => $this->destination->code,
                    'name' => $this->destination->name,
                    'currency' => $this->destination->currency,
                    'balance' => $this->destination->balance,
                ] : null;
            }),
            'lender_id' => $this->lender_id,
            'lender' => $this->whenLoaded('lender', function () {
                return $this->lender ? [
                    'id' => $this->lender->id,
                    'name' => $this->lender->name,
                    'address' => $this->lender->address,
                    'email' => $this->lender->email,
                    'phone' => $this->lender->phone,
                    'kra_pin' => $this->lender->kra_pin,
                ] : null;
            }),
            'chart_of_account' => $this->chart_of_account,
            'chart_of_account_data' => $this->whenLoaded('chartOfAccount', function () {
                return $this->chartOfAccount ? [
                    'id' => $this->chartOfAccount->id,
                    'code' => $this->chartOfAccount->code,
                    'name' => $this->chartOfAccount->name,
                    'is_bank_account_grp' => (bool) $this->chartOfAccount->is_bank_account_grp,
                ] : null;
            }),
            'lender_name' => $this->lender_name,
            'principal' => $this->principal,
            'principal_kes' => (float) $this->principal_kes,
            'currency' => $this->currency,
            'interest_type' => $this->interest_type,
            'interest_rate' => $this->interest_rate,
            'tenure_months' => $this->tenure_months,
            'repayment_frequency' => $this->repayment_frequency,
            'disbursement_date' => $this->disbursement_date?->toDateString(),
            'first_payment_date' => $this->first_payment_date?->toDateString(),
            'installment_amount' => $this->installment_amount,
            'status' => $this->status,
            'description' => $this->description,
            'disbursement_transaction_id' => $this->disbursement_transaction_id,
            'schedule' => $this->whenLoaded('schedule', function () {
                return $this->schedule->map(function ($row) {
                    return [
                        'id' => $row->id,
                        'installment_number' => $row->installment_number,
                        'due_date' => $row->due_date?->toDateString(),
                        'expected_principal' => $row->expected_principal,
                        'expected_interest' => $row->expected_interest,
                        'status' => $row->status,
                    ];
                });
            }),
            'repayments' => $this->whenLoaded('repayments', function () {
                return $this->repayments->map(function ($row) {
                    return [
                        'id' => $row->id,
                        'payment_date' => $row->payment_date?->toDateString(),
                        'amount_paid' => $row->amount_paid,
                        'principal_component' => $row->principal_component,
                        'interest_component' => $row->interest_component,
                        'balance_after' => $row->balance_after,
                        'paid_from_account_id' => $row->paid_from_account_id,
                        'paid_from_account' => $row->paidFromAccount ? [
                            'id' => $row->paidFromAccount->id,
                            'code' => $row->paidFromAccount->code,
                            'name' => $row->paidFromAccount->name,
                        ] : null,
                        'payment_reference' => $row->payment_reference,
                        'notes' => $row->notes,
                    ];
                });
            }),
            'summary' => $this->when(
                $this->relationLoaded('destination') && $this->relationLoaded('repayments') && $this->relationLoaded('schedule'),
                function () {
                    $model = $this->resource;

                    return app(\App\Services\LoanService::class)->summary($model);
                }
            ),
            'updated_at' => $this->formatTimestamp($this->updated_at),
            'updated_by' => $this->updated_by,
            'created_at' => $this->formatTimestamp($this->created_at),
            'created_by' => $this->created_by,
        ];
    }
}