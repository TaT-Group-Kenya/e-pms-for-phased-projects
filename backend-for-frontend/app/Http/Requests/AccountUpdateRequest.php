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
            'currency' => ['sometimes', 'required', 'string', 'max:10', 'exists:currencies,code'],
            'balance' => ['sometimes', 'required', 'string', 'max:255'],
            'overdraft_allowed' => ['sometimes', 'required', 'numeric', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
