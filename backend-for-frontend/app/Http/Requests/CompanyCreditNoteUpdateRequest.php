<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompanyCreditNoteUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'credit_note_number' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('company_credit_notes')->ignore(
                    $this->route('company_credit_note')
                )],
            'invoice_id' => ['nullable', 'exists:company_invoices,id'],
            'credit_note_date' => ['sometimes', 'required', 'date'],
            'reason' => ['sometimes', 'required', 'string', 'max:255'],
            'subtotal_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'tax_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'total_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'currency' => ['sometimes', 'required', 'string', 'max:255'],
            'exchange_rate' => ['sometimes', 'required', 'numeric', 'min:0'],
            'status' => ['sometimes', 'required', Rule::in(['draft','raised','refunded'])],
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
