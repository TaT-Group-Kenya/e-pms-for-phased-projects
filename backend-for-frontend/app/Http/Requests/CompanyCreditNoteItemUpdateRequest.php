<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompanyCreditNoteItemUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'credit_note_id' => ['nullable', 'exists:company_credit_notes,id'],
            'item_name' => ['sometimes', 'required', 'string', 'max:255'],
            'item_description' => ['sometimes', 'required', 'string', 'max:255'],
            'item_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'quantity' => ['sometimes', 'integer', 'min:1'],
            'is_taxable' => ['sometimes', 'required', 'boolean'],
            'tax_id' => ['sometimes', 'nullable', 'integer', 'exists:taxes,id'],
            'tax_item_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'item_type' => ['sometimes', 'nullable', 'string', 'max:255', Rule::in(['fixed', 'percent'])],
            'item_value' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'tax_amount' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'custom_note' => ['sometimes', 'required', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
