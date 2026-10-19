<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CustDebitNoteItemUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'debit_note_id' => ['prohibited'],
            'item_name' => ['sometimes', 'required', 'string', 'max:255'],
            'item_description' => ['sometimes', 'nullable', 'string'],
            'item_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'quantity' => ['sometimes', 'integer', 'min:1'],
            'is_taxable' => ['sometimes', 'required', 'boolean'],
            'tax_id' => ['nullable', 'integer', 'exists:taxes,id'],
            'tax_item_name' => ['nullable', 'string', 'max:255'],
            'item_type' => ['nullable', Rule::in(['fixed', 'percent'])],
            'item_value' => ['nullable', 'numeric', 'min:0'],
            'custom_note' => ['nullable', 'string'],
            'total' => ['prohibited'],
            'tax_amount' => ['prohibited'],
        ];
    }
}
