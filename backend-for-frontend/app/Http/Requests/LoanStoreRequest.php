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
            'account_id' => ['required', 'integer', 'exists:accounts,id'],
            'lender_name' => ['required', 'string', 'max:255'],
            'principal' => ['required', 'numeric', 'min:0.01'],
            'currency' => ['required', 'string', 'max:10'],
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
        // A loan can only live on a Loans-group account, and its currency
        // must match the account's currency.
        $validator->after(function ($validator) {
            $accountId = $this->input('account_id');

            if (! $accountId) {
                return;
            }

            $account = \App\Models\Account::find($accountId);

            if (! $account) {
                return;
            }

            if ($account->group !== 'Loans') {
                $validator->errors()->add(
                    'account_id',
                    'Loans can only be recorded on accounts in the Loans group.'
                );
            }

            if ($this->input('currency') && $this->input('currency') !== $account->currency) {
                $validator->errors()->add(
                    'currency',
                    'Loan currency must match the account currency ('.$account->currency.').'
                );
            }

            if ($this->input('interest_type') !== 'none' && (float) $this->input('interest_rate', 0) <= 0) {
                $validator->errors()->add(
                    'interest_rate',
                    'Interest rate is required when interest type is not none.'
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