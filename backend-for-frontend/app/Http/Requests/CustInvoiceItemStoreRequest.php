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
            'is_taxable' => ['required', 'boolean'],
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
