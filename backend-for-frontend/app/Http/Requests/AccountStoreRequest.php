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
            'type' => ['required', Rule::in(['cash','mpesa','bank'])],
            'group' => ['required', Rule::in(['Petty','Checking','Savings'])],
            'currency' => ['required', 'string', 'max:10', 'exists:currencies,code'],
            'balance' => ['required', 'string', 'max:255'],
            'overdraft_allowed' => ['required', 'numeric', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
