<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CustPaymentAllocationUpdateRequest extends FormRequest
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
            'allocated_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'allocation_date' => ['sometimes', 'required', 'date'],
            'balance_before_payment' => ['sometimes', 'required', 'string', 'max:255'],
            'balance_after_payment' => ['sometimes', 'required', 'string', 'max:255'],
            'installment_number' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('cust_payment_allocations')->ignore(
                    $this->route('cust_payment_allocation')
                )],
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
