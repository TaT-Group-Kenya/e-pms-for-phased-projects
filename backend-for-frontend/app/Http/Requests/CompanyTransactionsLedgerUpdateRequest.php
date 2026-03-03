<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompanyTransactionsLedgerUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_payment_id' => ['sometimes', 'required', 'exists:company_payments,id'],
            'transaction_number' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('company_transactions_ledger')->ignore($this->route('company_transactions_ledger')),
            ],
            'transaction_type' => ['sometimes', 'required', Rule::in(['payment', 'receipt', 'refund'])],
            'transaction_date' => ['sometimes', 'required', 'date'],
            'posted_date' => ['sometimes', 'required', 'date', 'after_or_equal:transaction_date'],
            'amount' => ['sometimes', 'required', 'numeric'],
            'base_currency' => ['sometimes', 'required', 'string', 'max:3'],
            'exchange_rate' => ['sometimes', 'required', 'numeric', 'min:0'],
            'converted_amount' => ['sometimes', 'required', 'numeric'],
            'tax_amount' => ['sometimes', 'required', 'numeric'],
            'net_amount' => ['sometimes', 'required', 'numeric'],
            'company_id' => ['sometimes', 'required', 'exists:companies,id'],
            'customer_id' => ['nullable', 'exists:customers,id'],
            'source_type' => ['sometimes', 'required', Rule::in(['customer invoice', 'customer credit note', 'company invoice', 'expense'])],
            'source_id' => ['nullable', 'integer'],
            'account_debit' => ['nullable', 'string', 'max:255'],
            'account_credit' => ['nullable', 'string', 'max:255'],
            'category' => ['sometimes', 'required', Rule::in(['revenue', 'expense'])],
            'payment_method' => ['nullable', 'string', 'max:255'],
            'bank_account' => ['nullable', 'string', 'max:255'],
            'check_number' => ['nullable', 'string', 'max:255'],
            'transaction_status' => ['sometimes', 'required', Rule::in(['pending', 'cleared', 'reconciled', 'void'])],
            'related_transaction_id' => ['nullable', 'exists:transactions,id'],
            'narration' => ['nullable', 'string'],
            'is_recurring' => ['sometimes', 'required', 'boolean'],
            'fiscal_year' => ['sometimes', 'required', 'string', 'max:255'],
            'accounting_period' => ['sometimes', 'required', 'string', 'max:255'],
            'is_adjusting_entry' => ['sometimes', 'required', 'boolean'],
            'cost_center_id' => ['nullable', 'exists:departments,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'posted_date.after_or_equal' => 'The posted date must be after or equal to the transaction date.',
            'transaction_number.unique' => 'This transaction number already exists in the company ledger.',
        ];
    }
}
