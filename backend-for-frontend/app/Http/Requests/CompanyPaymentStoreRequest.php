<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompanyPaymentStoreRequest extends FormRequest
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
            'amount_paid' => ['required', 'numeric', 'min:0'],
            'payment_date' => ['required', 'date'],
            'payment_method' => ['required', 'string', 'max:255'],
            'payment_status' => ['required', Rule::in(['pending','complete'])],
            'currency' => ['required', 'string', 'max:255'],
            'exchange_rate' => ['required', 'numeric', 'min:0'],
            'bank_name' => ['required', 'string', 'max:255'],
            'check_number' => ['required', 'string', 'max:255'],
            'transaction_reference' => ['required', 'string', 'max:255'],
            'receipt_number' => ['required', 'string', 'max:255'],
            'reconciled' => ['required', 'string', 'max:255'],
            'reconciliation_date' => ['required', 'date'],
            'updated_at' => ['required', 'date'],
            'updated_by' => ['nullable', 'exists:users,id'],
            'created_at' => ['required', 'date'],
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
