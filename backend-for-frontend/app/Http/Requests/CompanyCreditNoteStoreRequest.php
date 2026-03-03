<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompanyCreditNoteStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'credit_note_number' => ['nullable', 'string', 'max:255', 'unique:company_credit_notes,credit_note_number'],
            'invoice_id' => ['required', 'exists:company_invoices,id'],
            'credit_note_date' => ['required', 'date'],
            'reason' => ['required', 'string', 'max:255'],
            'subtotal_amount' => ['required', 'numeric', 'min:0'],
            'tax_amount' => ['required', 'numeric', 'min:0'],
            'total_amount' => ['required', 'numeric', 'min:0'],
            'currency' => ['required', 'string', 'max:255'],
            'exchange_rate' => ['required', 'numeric', 'min:0'],
            'status' => ['required', Rule::in(['draft','raised','refunded'])],
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
