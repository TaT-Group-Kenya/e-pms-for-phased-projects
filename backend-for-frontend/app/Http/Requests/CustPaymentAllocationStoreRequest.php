<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CustPaymentAllocationStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'payment_id' => ['nullable', 'exists:payments,id'],
            'invoice_id' => ['nullable', 'exists:invoices,id'],
            'allocated_amount' => ['required', 'numeric', 'min:0'],
            'allocation_date' => ['required', 'date'],
            'balance_before_payment' => ['required', 'string', 'max:255'],
            'balance_after_payment' => ['required', 'string', 'max:255'],
            'installment_number' => ['required', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
