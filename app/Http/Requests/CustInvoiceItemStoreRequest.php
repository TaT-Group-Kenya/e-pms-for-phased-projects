<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CustInvoiceItemStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
        ];
    }
}
