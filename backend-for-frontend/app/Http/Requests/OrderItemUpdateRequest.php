<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OrderItemUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order_id' => ['nullable', 'exists:orders,id'],
            'item_name' => ['sometimes', 'required', 'string', 'max:255'],
            'item_description' => ['sometimes', 'nullable', 'string', 'max:255'],
            'order_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'quantity' => ['sometimes', 'integer', 'min:1'],
            'custom_note' => ['sometimes', 'nullable', 'string', 'max:255'],
            'is_taxable' => ['sometimes', 'required', 'boolean'],
            'tax_id' => ['sometimes', 'nullable', 'integer', 'exists:taxes,id'],
            'tax_item_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'item_type' => ['sometimes', 'nullable', 'string', 'max:255', \Illuminate\Validation\Rule::in(['fixed', 'percent'])],
            'item_value' => ['sometimes', 'nullable', 'numeric', 'min:0'],
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
