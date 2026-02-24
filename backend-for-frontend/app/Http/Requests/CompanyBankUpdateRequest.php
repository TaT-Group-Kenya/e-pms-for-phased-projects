<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompanyBankUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_id' => ['nullable', 'exists:companys,id'],
            'type' => ['sometimes', 'required', Rule::in(['Bank','MPESA'])],
            'account_no' => ['sometimes', 'required', 'string', 'max:255'],
            'swiftcode' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('company_banks')->ignore(
                    $this->route('company_bank')
                )],
            'branch' => ['sometimes', 'required', 'string', 'max:255'],
            'account_holder_name' => ['sometimes', 'required', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
