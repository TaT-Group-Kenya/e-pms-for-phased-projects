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
            'invoice_id' => ['nullable', 'exists:company_invoices,id'],
            'tax_id' => ['sometimes', 'required', 'integer', 'exists:taxes,id'],
            // item_name is derived from the linked Tax record when a tax_id is provided
            'item_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'item_type' => ['sometimes', 'required', 'string', 'max:255', Rule::in(['fixed', 'percent'])],
            'item_value' => ['sometimes', 'required', 'numeric', 'min:0'],
            'item_amount' => ['sometimes', 'nullable', 'numeric', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
