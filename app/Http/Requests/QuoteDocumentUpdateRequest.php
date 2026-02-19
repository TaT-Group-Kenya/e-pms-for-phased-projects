<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class QuoteDocumentUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'quotation_id' => ['nullable', 'exists:quotations,id'],
            'document_path' => ['sometimes', 'required', 'string', 'max:255'],
            'document_type' => ['sometimes', 'required', Rule::in(['proposal','terms','attachments'])],
            'attachments' => ['sometimes', 'required', 'string', 'max:255'],
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
