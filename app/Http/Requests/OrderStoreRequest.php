<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OrderStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order_number' => ['required', 'string', 'max:255'],
            'quotation_id' => ['nullable', 'exists:quotations,id'],
            'project_id' => ['nullable', 'exists:projects,id'],
            'customer_id' => ['nullable', 'exists:customers,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:255'],
            'status' => ['required', Rule::in(['draft','sent','approved','rejected','revised'])],
            'subtotal_amount' => ['required', 'numeric', 'min:0'],
            'tax_percentage' => ['required', 'numeric', 'min:0'],
            'tax_amount' => ['required', 'numeric', 'min:0'],
            'discount_percentage' => ['required', 'string', 'max:255'],
            'discount_amount' => ['required', 'numeric', 'min:0'],
            'total_amount' => ['required', 'numeric', 'min:0'],
            'currency' => ['required', 'string', 'max:255'],
            'payment_terms' => ['required', 'string', 'max:255'],
            'notes_to_customer' => ['required', 'string', 'max:255'],
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
