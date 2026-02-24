<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompanyInvoiceStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'invoice_number' => ['required', 'string', 'max:255'],
            'project_id' => ['nullable', 'exists:projects,id'],
            'company_id' => ['nullable', 'exists:companies,id'],
            'project_phase_id' => ['nullable', 'exists:project_phases,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:255'],
            'status' => ['required', Rule::in(['draft','sent','paid','overdue','partially-paid','cancelled'])],
            'subtotal_amount' => ['required', 'numeric', 'min:0'],
            'tax_percentage' => ['required', 'numeric', 'min:0'],
            'tax_amount' => ['required', 'numeric', 'min:0'],
            'discount_percentage' => ['required', 'string', 'max:255'],
            'discount_amount' => ['required', 'numeric', 'min:0'],
            'total_amount' => ['required', 'numeric', 'min:0'],
            'currency' => ['required', 'string', 'max:255'],
            'payment_terms' => ['required', 'string', 'max:255'],
            'notes_to_customer' => ['required', 'string', 'max:255'],
            'valid_until' => ['required', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
