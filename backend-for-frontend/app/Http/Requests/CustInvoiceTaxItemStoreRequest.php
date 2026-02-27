<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CustInvoiceTaxItemStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'invoice_id' => ['nullable', 'exists:cust_invoices,id'],
            'tax_id' => ['required', 'integer', 'exists:taxes,id'],
            // item_name is derived from the linked Tax record when a tax_id is provided
            'item_name' => ['nullable', 'string', 'max:255'],
            'item_type' => ['required', Rule::in(['fixed','percent'])],
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
