<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompanyInvoiceTaxItemUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'invoice_id' => ['nullable', 'exists:invoices,id'],
            'tax_id' => ['sometimes', 'nullable', 'integer', 'exists:taxes,id'],
            'item_name' => ['sometimes', 'required_without:tax_id', 'string', 'max:255'],
            'item_type' => ['sometimes', 'required', Rule::in(['fixed','percent'])],
            'item_value' => ['sometimes', 'required', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
