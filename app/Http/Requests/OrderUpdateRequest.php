<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OrderUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order_number' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('orders')->ignore(
                    $this->route('order')
                )],
            'quotation_id' => ['nullable', 'exists:quotations,id'],
            'project_id' => ['nullable', 'exists:projects,id'],
            'customer_id' => ['nullable', 'exists:customers,id'],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string', 'max:255'],
            'status' => ['sometimes', 'required', Rule::in(['draft','sent','approved','rejected','revised'])],
            'subtotal_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'tax_percentage' => ['sometimes', 'required', 'numeric', 'min:0'],
            'tax_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'discount_percentage' => ['sometimes', 'required', 'string', 'max:255'],
            'discount_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'total_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'currency' => ['sometimes', 'required', 'string', 'max:255'],
            'payment_terms' => ['sometimes', 'required', 'string', 'max:255'],
            'notes_to_customer' => ['sometimes', 'required', 'string', 'max:255'],
            'updated_at' => ['sometimes', 'required', 'date'],
            'updated_by' => ['nullable', 'exists:users,id'],
            'created_at' => ['sometimes', 'required', 'date'],
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
