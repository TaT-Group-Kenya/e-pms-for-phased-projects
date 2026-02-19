<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompanyCreditNoteTaxItemStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'credit_note_id' => ['nullable', 'exists:credit_notes,id'],
            'item_name' => ['required', 'string', 'max:255'],
            'item_type' => ['required', Rule::in(['fixed','percent'])],
            'item_value' => ['required', 'string', 'max:255'],
            'updated_at' => ['required', 'date'],
            'updated_by' => ['nullable', 'exists:users,id'],
            'created_at' => ['required', 'date'],
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
