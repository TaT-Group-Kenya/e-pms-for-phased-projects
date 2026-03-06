<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CustInvoiceItemStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'invoice_id' => ['nullable', 'exists:invoices,id'],
            'project_phase_id' => ['nullable', 'exists:project_phases,id'],
            'item_name' => ['required', 'string', 'max:255'],
            'item_description' => ['required', 'string', 'max:255'],
            'item_amount' => ['required', 'numeric', 'min:0'],
            'quantity' => ['sometimes', 'integer', 'min:1'],
            'is_taxable' => ['required', 'boolean'],
            'tax_id' => ['nullable', 'integer', 'exists:taxes,id'],
            'tax_item_name' => ['nullable', 'string', 'max:255'],
            'item_type' => ['nullable', 'string', 'max:255', Rule::in(['fixed', 'percent'])],
            'item_value' => ['nullable', 'numeric', 'min:0'],
            'tax_amount' => ['nullable', 'numeric', 'min:0'],
            'custom_note' => ['required', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
