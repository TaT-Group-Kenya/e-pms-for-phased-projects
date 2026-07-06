<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AccountUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('accounts')->ignore(
                $this->route('account')
            )],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string', 'max:255'],
            'type' => ['sometimes', 'required', Rule::in(['cash','mpesa','bank'])],
            'group' => ['sometimes', 'required', Rule::in(['Petty','Checking','Savings'])],
            // currency and balance are controlled by the backend and cannot be changed via update
            'currency' => ['sometimes', 'string', 'max:10', 'exists:currencies,code'],
            'balance' => ['sometimes', 'numeric', 'max:100000000000000'],
            'overdraft_allowed' => ['sometimes', 'required', 'numeric', 'max:1'],
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
