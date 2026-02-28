<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CustPaymentUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'transaction_number' => ['sometimes', 'string', 'max:255'],
            'amount_paid' => ['sometimes', 'numeric', 'min:0.01'],
            'tax_amount' => ['sometimes', 'numeric', 'min:0'],
            'net_amount' => ['sometimes', 'numeric', 'min:0'],
            'payment_date' => ['sometimes', 'date'],
            'payment_method' => ['sometimes', Rule::in(['cash', 'mpesa', 'bank_transfer', 'check'])],
            'payment_status' => ['sometimes', Rule::in(['pending', 'complete'])],
            'currency' => ['sometimes', 'string', 'max:255'],
            'bank_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'check_number' => ['sometimes', 'nullable', 'string', 'max:255'],
            'transaction_reference' => ['sometimes', 'nullable', 'string', 'max:255'],
            'receipt_number' => ['sometimes', 'string', 'max:255'],
            'invoice_total_amount' => ['sometimes', 'numeric'],
            'exchange_rate' => ['sometimes', 'numeric', 'min:0'],
            'fee_or_charge' => ['sometimes', 'numeric', 'min:0'],
            'reconciled' => ['sometimes', 'boolean'],
            'reconciliation_date' => ['sometimes', 'nullable', 'date'],
        ];
    }
}
