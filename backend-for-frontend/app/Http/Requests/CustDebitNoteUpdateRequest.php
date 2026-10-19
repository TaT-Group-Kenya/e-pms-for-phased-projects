<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CustDebitNoteUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'invoice_id' => ['sometimes', 'required', 'exists:cust_invoices,id'],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'status' => ['sometimes', 'required', 'in:draft,raised'],
            'currency' => ['sometimes', 'string', 'max:10'],
            'notes_to_customer' => ['sometimes', 'nullable', 'string'],
            'subtotal_amount' => ['prohibited'],
            'tax_amount' => ['prohibited'],
            'total_amount' => ['prohibited'],
            'debit_note_number' => ['prohibited'],
        ];
    }
}
