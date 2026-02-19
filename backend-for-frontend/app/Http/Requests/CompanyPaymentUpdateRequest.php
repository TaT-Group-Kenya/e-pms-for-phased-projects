<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompanyPaymentUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'transaction_id' => ['nullable', 'exists:transactions,id'],
            'invoice_id' => ['nullable', 'exists:invoices,id'],
            'amount_paid' => ['sometimes', 'required', 'numeric', 'min:0'],
            'payment_date' => ['sometimes', 'required', 'date'],
            'payment_method' => ['sometimes', 'required', 'string', 'max:255'],
            'payment_status' => ['sometimes', 'required', Rule::in(['pending','complete'])],
            'currency' => ['sometimes', 'required', 'string', 'max:255'],
            'exchange_rate' => ['sometimes', 'required', 'numeric', 'min:0'],
            'bank_name' => ['sometimes', 'required', 'string', 'max:255'],
            'check_number' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('company_payments')->ignore(
                    $this->route('company_payment')
                )],
            'transaction_reference' => ['sometimes', 'required', 'string', 'max:255'],
            'receipt_number' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('company_payments')->ignore(
                    $this->route('company_payment')
                )],
            'reconciled' => ['sometimes', 'required', 'string', 'max:255'],
            'reconciliation_date' => ['sometimes', 'required', 'date'],
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
