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
            'quotation_id' => ['sometimes', 'required', 'exists:quotations,id'],
            'job_reference_id' => [
                'sometimes',
                'required',
                'string',
                'max:32',
                Rule::unique('orders', 'job_reference_id')
                    ->ignore($this->route('order') ?? $this->route('id'))
                    ->where(fn ($q) => $q->where('is_deleted', false)),
            ],
            'customer_id' => ['sometimes', 'required', 'exists:customers,id'],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string', 'max:255'],
            'status' => ['sometimes', 'required', Rule::in(['draft','sent','approved','rejected','revised'])],
            'subtotal_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'tax_amount' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'discount_percentage' => ['sometimes', 'nullable', 'string', 'max:255'],
            'discount_amount' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'total_amount' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'currency' => ['sometimes', 'required', 'string', 'max:255'],
            'payment_terms' => ['sometimes', 'nullable', 'string', 'max:255'],
            'notes_to_customer' => ['sometimes', 'nullable', 'string', 'max:255'],
            'created_at' => ['sometimes', 'required', 'date'],

        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
