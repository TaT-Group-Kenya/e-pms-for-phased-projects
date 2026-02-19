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
            'project_phase_id' => ['nullable', 'exists:project_phases,id'],
            'item_name' => ['required', 'string', 'max:255'],
            'item_description' => ['required', 'string', 'max:255'],
            'order_amount' => ['required', 'numeric', 'min:0'],
            'custom_note' => ['required', 'string', 'max:255'],
            'is_taxable' => ['required', 'boolean'],
            'updated_at' => ['required', 'date'],
            'updated_by' => ['nullable', 'exists:users,id'],
            'created_at' => ['required', 'date'],
            'created_by' => ['nullable', 'exists:users,id'],
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
