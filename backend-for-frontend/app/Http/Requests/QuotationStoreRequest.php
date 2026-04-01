<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class QuotationStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'quotation_number' => ['nullable', 'string', 'max:255'],
            'job_reference_id' => [
                'required',
                'string',
                'max:32',
                Rule::unique('quotations', 'job_reference_id')->where(fn ($q) => $q->where('is_deleted', false)),
            ],
            'customer_id' => ['nullable', 'exists:customers,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(['draft','sent','approved','rejected','revised'])],
            'valid_until_date' => ['required', 'date'],
            'subtotal_amount' => ['required', 'numeric', 'min:0'],
            'tax_amount' => ['required', 'numeric', 'min:0'],
            'discount_percentage' => ['required', 'numeric', 'min:0'],
            'discount_amount' => ['required', 'numeric', 'min:0'],
            'total_amount' => ['required', 'numeric', 'min:0'],
            'currency' => ['required', 'string', 'max:255'],
            'payment_terms' => ['nullable', 'string', 'max:255'],
            'min_approval_count' => ['nullable', 'numeric', 'min:1'],
            'notes_to_customer' => ['nullable', 'string', 'max:255'],
            'creationDate' => ['required', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
