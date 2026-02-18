<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CustCreditNoteItemStoreRequest extends FormRequest
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
