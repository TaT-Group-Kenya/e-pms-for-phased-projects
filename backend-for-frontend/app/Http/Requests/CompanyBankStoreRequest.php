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
            'company_id' => ['nullable', 'exists:companies,id'],
            'type' => ['required', Rule::in(['Bank','MPESA', 'CASH'])],
            'account_no' => ['required', 'string', 'max:255'],
            'swiftcode' => ['nullable', 'string', 'max:255'],
            'branch' => ['required', 'string', 'max:255'],
            'account_holder_name' => ['required', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
