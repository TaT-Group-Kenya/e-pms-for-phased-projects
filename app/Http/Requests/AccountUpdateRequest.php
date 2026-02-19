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
            'balance' => ['sometimes', 'required', 'string', 'max:255'],
            'overdraft_allowed' => ['sometimes', 'required', 'string', 'max:255'],
            'updated_at' => ['sometimes', 'required', 'date'],
            'updated_by' => ['nullable', 'exists:users,id'],
            'created_at' => ['sometimes', 'required', 'date'],
            'created_by' => ['nullable', 'exists:users,id'],
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
