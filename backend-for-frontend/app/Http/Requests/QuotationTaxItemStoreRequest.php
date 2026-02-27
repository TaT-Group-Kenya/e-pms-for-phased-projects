<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class QuotationTaxItemStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'quotation_id' => ['nullable', 'exists:quotations,id'],
            'tax_id' => ['required', 'integer', 'exists:taxes,id'],
            'item_type' => ['required', 'string', 'max:255', Rule::in(['fixed', 'percent'])],
            'item_value' => ['required', 'numeric', 'min:0'],
            'item_amount' => ['nullable', 'numeric', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            // Custom messages can be added here if needed
        ];
    }
}
