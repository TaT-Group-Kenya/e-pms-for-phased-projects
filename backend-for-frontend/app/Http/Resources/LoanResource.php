<?php

namespace App\Http\Resources;

class LoanResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'account_id' => $this->account_id,
            'account' => $this->whenLoaded('account', function () {
                return $this->account ? [
                    'id' => $this->account->id,
                    'code' => $this->account->code,
                    'name' => $this->account->name,
                    'currency' => $this->account->currency,
                    'balance' => $this->account->balance,
                ] : null;
            }),
            'lender_name' => $this->lender_name,
            'principal' => $this->principal,
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
                $this->relationLoaded('account') && $this->relationLoaded('repayments') && $this->relationLoaded('schedule'),
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