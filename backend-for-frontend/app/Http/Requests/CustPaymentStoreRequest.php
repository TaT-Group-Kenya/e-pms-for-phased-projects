<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CustPaymentStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'transaction_number' => ['nullable', 'string', 'max:255'],
            'amount_paid' => ['required', 'numeric', 'min:0.01'],
            'tax_amount' => ['nullable', 'numeric', 'min:0'],
            'net_amount' => ['nullable', 'numeric', 'min:0'],
            'payment_date' => ['required', 'date'],
            'payment_method' => ['required', Rule::in(['cash', 'mpesa', 'bank_transfer', 'check'])],
            'payment_status' => ['required', Rule::in(['pending', 'complete'])],
            'currency' => ['required', 'string', 'max:255'],
            'bank_name' => ['nullable', 'string', 'max:255'],
            'check_number' => ['nullable', 'string', 'max:255'],
            'transaction_reference' => ['nullable', 'string', 'max:255'],
            'receipt_number' => ['required', 'string', 'max:255'],
            'invoice_total_amount' => ['nullable', 'numeric'],
            'exchange_rate' => ['required', 'numeric', 'min:0'],
            'fee_or_charge' => ['required', 'numeric', 'min:0'],
            'reconciled' => ['sometimes', 'boolean'],
            'reconciliation_date' => ['nullable', 'date'],
        ];
    }
}
