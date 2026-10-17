<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CustDebitNoteStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'invoice_id' => ['required', 'exists:cust_invoices,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['sometimes', 'in:draft'],
            'currency' => ['sometimes', 'string', 'max:10'],
            'notes_to_customer' => ['nullable', 'string'],
        ];
    }
}
