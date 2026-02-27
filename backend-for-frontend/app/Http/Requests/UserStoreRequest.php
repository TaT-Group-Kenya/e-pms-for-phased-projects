<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'max:255'],
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'password' => ['nullable', 'string', 'max:255'],
            'email_verified_at' => ['nullable', 'date'],
            'remember_token' => ['nullable', 'string', 'max:255'],
            'avatar_pic' => ['nullable', 'string', 'max:255'],
            'category' => ['required', Rule::in(['internal','company','customer'])],
            'is_active' => ['required', 'boolean'],
            'company_id' => ['nullable', 'exists:companies,id'],
            'customer_id' => ['nullable', 'exists:customers,id'],
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
