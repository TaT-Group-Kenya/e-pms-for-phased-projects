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
            'project_phase_id' => ['nullable', 'exists:project_phases,id'],
            'item_name' => ['sometimes', 'required', 'string', 'max:255'],
            'item_description' => ['sometimes', 'required', 'string', 'max:255'],
            'order_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'quantity' => ['sometimes', 'integer', 'min:1'],
            'custom_note' => ['sometimes', 'required', 'string', 'max:255'],
            'is_taxable' => ['sometimes', 'required', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
