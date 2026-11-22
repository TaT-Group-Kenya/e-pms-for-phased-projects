<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LoanStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'destination_account_id' => ['required', 'integer', 'exists:accounts,id'],
            'lender_id' => ['required_without:lender_name', 'nullable', 'integer', 'exists:lenders,id'],
            'lender_name' => ['prohibited_unless:lender_id,null', 'nullable', 'string', 'max:255'],
            'principal' => ['required', 'numeric', 'min:0.01'],
            'currency' => ['required', 'string', 'max:10', 'exists:currencies,code'],
            'forex_rate' => ['nullable', 'numeric', 'min:0.000001'],
            'chart_of_account' => ['nullable', 'integer', 'exists:chart_of_accounts,id'],
            'interest_type' => ['required', Rule::in(['none', 'flat', 'reducing'])],
            'interest_rate' => ['nullable', 'numeric', 'min:0', 'max:1000'],
            'tenure_months' => ['required', 'integer', 'min:1', 'max:600'],
            'repayment_frequency' => ['required', Rule::in(['monthly', 'quarterly', 'weekly'])],
            'disbursement_date' => ['required', 'date'],
            'first_payment_date' => ['nullable', 'date', 'after_or_equal:disbursement_date'],
            'description' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function withValidator($validator)
    {
        // The loaned money lands directly on a destination account, and the
        // Loan entity itself carries the liability. The destination must be
        // an asset (chart 1000) account in the selected loan currency. The
        // chart defaults to the Liabilities chart (2000).
        $validator->after(function ($validator) {
            $liabilitiesId = \App\Models\ChartOfAccount::where('code', '2000')->value('id');

            $this->merge(['chart_of_account' => $this->input('chart_of_account') ?: $liabilitiesId]);

            $accountId = $this->input('destination_account_id');

            if (! $accountId) {
                return;
            }

            $account = \App\Models\Account::find($accountId);

            if (! $account) {
                return;
            }

            $chartCode = $account->chartOfAccount?->code;

            if ($chartCode !== '1000') {
                $validator->errors()->add(
                    'destination_account_id',
                    'Loans can only be disbursed to asset (chart 1000) accounts.'
                );
            }

            if ($this->input('currency') && $this->input('currency') !== $account->currency) {
                $validator->errors()->add(
                    'currency',
                    'Loan currency must match the destination account currency ('.$account->currency.').'
                );
            }

            if ($this->input('interest_type') !== 'none' && (float) $this->input('interest_rate', 0) <= 0) {
                $validator->errors()->add(
                    'interest_rate',
                    'Interest rate is required when interest type is not none.'
                );
            }

            // A USD→KES forex rate is mandatory for non-KES loans.
            if ($this->input('currency') !== 'KES' && ! ((float) $this->input('forex_rate', 0) > 0)) {
                $validator->errors()->add(
                    'forex_rate',
                    'A USD to KES forex rate is required for non-KES loans.'
                );
            }
        });
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}