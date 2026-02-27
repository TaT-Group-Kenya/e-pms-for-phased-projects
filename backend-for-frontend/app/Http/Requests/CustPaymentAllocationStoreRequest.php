<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\CustInvoice;

class CustPaymentAllocationStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'payment_id' => ['nullable', 'exists:cust_payments,id'],
            'invoice_id' => [
                'nullable',
                'exists:cust_invoices,id',
                function ($attribute, $value, $fail) {
                    if (!$value) {
                        return;
                    }

                    $invoice = CustInvoice::find($value);
                    if (!$invoice) {
                        return;
                    }

                    if ($invoice->status !== 'sent') {
                        $fail('Payments can only be allocated to customer invoices in sent status.');
                    }
                },
            ],
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
