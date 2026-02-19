<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompanyInvoiceUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'invoice_number' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('company_invoices')->ignore(
                    $this->route('company_invoice')
                )],
            'project_id' => ['nullable', 'exists:projects,id'],
            'company_id' => ['nullable', 'exists:companys,id'],
            'project_phase_id' => ['nullable', 'exists:project_phases,id'],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string', 'max:255'],
            'status' => ['sometimes', 'required', Rule::in(['draft','sent','paid','overdue','partially-paid','cancelled'])],
            'subtotal_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'tax_percentage' => ['sometimes', 'required', 'numeric', 'min:0'],
            'tax_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'discount_percentage' => ['sometimes', 'required', 'string', 'max:255'],
            'discount_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'total_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'currency' => ['sometimes', 'required', 'string', 'max:255'],
            'payment_terms' => ['sometimes', 'required', 'string', 'max:255'],
            'notes_to_customer' => ['sometimes', 'required', 'string', 'max:255'],
            'valid_until' => ['sometimes', 'required', 'string', 'max:255'],
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
