<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompanyBankStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_id' => ['nullable', 'exists:companys,id'],
            'type' => ['required', Rule::in(['Bank','MPESA'])],
            'account_no' => ['required', 'string', 'max:255'],
            'swiftcode' => ['required', 'string', 'max:255'],
            'branch' => ['required', 'string', 'max:255'],
            'account_holder_name' => ['required', 'string', 'max:255'],
            'updated_at' => ['required', 'date'],
            'updated_by' => ['nullable', 'exists:users,id'],
            'created_at' => ['required', 'date'],
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
