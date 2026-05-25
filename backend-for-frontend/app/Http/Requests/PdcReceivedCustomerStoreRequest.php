<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PdcReceivedCustomerStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'transaction_number' => ['sometimes', 'string', 'max:255'],
            'customer_id' => ['required', 'integer', 'exists:customers,id'],
            'invoice_id' => ['nullable', 'integer', 'exists:cust_invoices,id'],
            'cheque_number' => ['required', 'string', 'max:255'],
            'cheque_date' => ['required', 'date', 'after_or_equal:today'],
            'received_date' => ['required', 'date'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'currency' => ['required', 'string', 'max:10'],
            'bank' => ['nullable', 'string', 'max:255'],
            'bank_branch' => ['nullable', 'string', 'max:255'],
            'bank_account_id' => ['nullable', 'integer', 'exists:accounts,id'],
            'status' => ['nullable', 'in:received,pending,cleared,bounced,cancelled'],
            'narration' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
