<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OrderTaxItemStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order_id' => ['nullable', 'exists:orders,id'],
            'tax_id' => ['required', 'integer', 'exists:taxes,id'],
            // item_name is derived from the linked Tax record when a tax_id is provided
            'item_name' => ['nullable', 'string', 'max:255'],
            'item_type' => ['required', 'string', 'max:255', Rule::in(['fixed', 'percent'])],
            'item_value' => ['required', 'numeric', 'min:0'],
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
