<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PdcReceivedCustomerUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'transaction_number' => ['sometimes', 'string', 'max:255'],
            'cheque_number' => ['sometimes', 'string', 'max:255'],
            'cheque_date' => ['sometimes', 'date', 'after_or_equal:today'],
            'received_date' => ['nullable', 'date'],
            'amount' => ['sometimes', 'numeric', 'min:0.01'],
            'currency' => ['sometimes', 'string', 'max:10'],
            'bank' => ['nullable', 'string', 'max:255'],
            'bank_branch' => ['nullable', 'string', 'max:255'],
            'bank_account_id' => ['nullable', 'integer', 'exists:accounts,id'],
            'status' => ['nullable', 'in:received,pending,cleared,bounced,cancelled'],
            'narration' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
