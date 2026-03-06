<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OrderItemStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order_id' => ['nullable', 'exists:orders,id'],
            'item_name' => ['required', 'string', 'max:255'],
            'item_description' => ['required', 'string', 'max:255'],
            'order_amount' => ['required', 'numeric', 'min:0'],
            'quantity' => ['sometimes', 'integer', 'min:1'],
            'custom_note' => ['required', 'string', 'max:255'],
            'is_taxable' => ['required', 'boolean'],
            'tax_id' => ['nullable', 'integer', 'exists:taxes,id'],
            'tax_item_name' => ['nullable', 'string', 'max:255'],
            'item_type' => ['nullable', 'string', 'max:255', \Illuminate\Validation\Rule::in(['fixed', 'percent'])],
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
