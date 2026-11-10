<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AccountStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::in(['cash', 'mpesa', 'bank'])],
            'group' => ['required', Rule::in(['Petty', 'Checking', 'Savings'])],
            // currency and balance are set in the backend; do not require them from the client
            'currency' => ['sometimes', 'string', 'max:10', 'exists:currencies,code'],
            'balance' => ['sometimes', 'numeric', 'max:100000000000000'],
            'overdraft_allowed' => ['required', 'numeric', 'max:1'],
            'chart_of_account_id' => [
                'required',
                'integer',
                'exists:chart_of_accounts,id',
            ],
        ];
    }

    public function withValidator($validator)
    {
        // (removed) Loans-group accounts no longer exist.
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
