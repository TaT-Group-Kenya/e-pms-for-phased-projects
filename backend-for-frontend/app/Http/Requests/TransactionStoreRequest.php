<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TransactionStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'transaction_number' => ['required', 'string', 'max:255', Rule::unique('transactions')],
            'transaction_type' => ['required', Rule::in(['payment', 'receipt', 'refund'])],
            'transaction_date' => ['required', 'date'],
            'posted_date' => ['required', 'date', 'after_or_equal:transaction_date'],
            'amount' => ['required', 'numeric', 'min:0'],
            'base_currency' => ['required', 'string', 'max:3'],
            'exchange_rate' => ['required', 'numeric', 'min:0'],
            'converted_amount' => ['required', 'numeric', 'min:0'],
            'tax_amount' => ['required', 'numeric', 'min:0'],
            'net_amount' => ['required', 'numeric', 'min:0'],
            'customer_id' => ['nullable', 'exists:customers,id'],
            'company_id' => ['nullable', 'exists:companies,id'],
            'source_type' => ['required', 'string', 'max:255'],
            'source_id' => ['nullable', 'integer'],
            'account_debit' => ['nullable', 'string', 'max:255'],
            'account_credit' => ['nullable', 'string', 'max:255'],
            'category' => ['required', Rule::in(['revenue', 'expense'])],
            'payment_method' => ['nullable', 'string', 'max:255'],
            'bank_account' => ['nullable', 'string', 'max:255'],
            'check_number' => ['nullable', 'string', 'max:255'],
            'transaction_status' => ['required', Rule::in(['pending', 'cleared', 'reconciled', 'void'])],
            'related_transaction_id' => ['nullable', 'exists:transactions,id'],
            'narration' => ['nullable', 'string'],
            'is_recurring' => ['required', 'boolean'],
            'fiscal_year' => ['required', 'string', 'max:255'],
            'accounting_period' => ['required', 'string', 'max:255'],
            'is_adjusting_entry' => ['required', 'boolean'],
            'cost_center_id' => ['nullable', 'exists:departments,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'posted_date.after_or_equal' => 'The posted date must be after or equal to the transaction date.',
            'transaction_number.unique' => 'This transaction number already exists.',
        ];
    }
}