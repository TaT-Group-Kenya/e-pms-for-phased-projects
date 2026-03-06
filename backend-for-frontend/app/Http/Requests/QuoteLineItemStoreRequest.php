<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class QuoteLineItemStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'quotation_id' => ['nullable', 'exists:quotations,id'],
            'item_name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'quoted_amount' => ['required', 'numeric', 'min:0'],
            'quantity' => ['required', 'integer', 'min:1'], // Allow optional quantity field
            'estimated_hours' => ['nullable', 'string', 'max:255'],
            'custom_note' => ['nullable', 'string', 'max:255'],
            'is_taxable' => ['required', 'boolean'],
            'tax_id' => ['nullable', 'integer', 'exists:taxes,id'],
            'tax_item_name' => ['nullable', 'string', 'max:255'],
            'item_type' => ['nullable', 'string', 'max:255', Rule::in(['fixed', 'percent'])],
            'item_value' => ['nullable', 'numeric', 'min:0'],
            'item_amount' => ['nullable', 'numeric', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
