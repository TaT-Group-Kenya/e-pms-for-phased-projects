<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OrderDocumentUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order_id' => ['nullable', 'exists:orders,id'],
            // On update, a new file is optional; when provided it will
            // overwrite the stored path on the model.
            'document_file' => ['sometimes', 'file'],
            'document_type' => ['sometimes', 'required', Rule::in(['proposal','terms','attachments'])],
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
