<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class QuotationUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_id' => ['nullable', 'exists:customers,id'],
            'job_reference_id' => [
                'sometimes',
                'required',
                'string',
                'max:32',
                Rule::unique('quotations', 'job_reference_id')
                    ->ignore($this->route('quotation') ?? $this->route('id'))
                    ->where(fn ($q) => $q->where('is_deleted', false)),
            ],
            'project_owner_id' => ['sometimes', 'nullable', 'exists:project_owners,id'],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string', 'max:255'],
            'status' => ['sometimes', 'required', Rule::in(['draft','sent','approved','rejected','revised'])],
            'valid_until_date' => ['sometimes', 'required', 'date'],
            'subtotal_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'tax_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'discount_percentage' => ['sometimes', 'required', 'numeric', 'min:0'],
            'discount_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'total_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'currency' => ['sometimes', 'nullable', 'string', 'max:255'],
            'payment_receiving_method_id' => ['sometimes', 'nullable', 'integer', 'exists:payment_receiving_methods,id'],
            'payment_terms' => ['sometimes', 'nullable', 'string', 'max:255'],
            'min_approval_count' => ['sometimes', 'required', 'numeric', 'min:1'],
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
