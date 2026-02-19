<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CustCreditNoteItemUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'credit_note_id' => ['nullable', 'exists:credit_notes,id'],
            'item_name' => ['sometimes', 'required', 'string', 'max:255'],
            'item_description' => ['sometimes', 'required', 'string', 'max:255'],
            'item_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'custom_note' => ['sometimes', 'required', 'string', 'max:255'],
            'updated_at' => ['sometimes', 'required', 'date'],
            'updated_by' => ['nullable', 'exists:users,id'],
            'created_at' => ['sometimes', 'required', 'date'],
            'created_by' => ['nullable', 'exists:users,id'],
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
