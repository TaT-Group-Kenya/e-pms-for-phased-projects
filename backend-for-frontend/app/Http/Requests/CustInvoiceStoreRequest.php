<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CustInvoiceStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order_id' => ['required', 'integer', 'exists:orders,id'],
            'bol_number' => ['nullable', 'string', 'max:255'],
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'payment_terms' => ['nullable', 'string', 'max:255'],
            'notes_to_customer' => ['nullable', 'string', 'max:255'],
            'payment_receiving_method_id' => ['required', 'integer', 'exists:payment_receiving_methods,id'],
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
