<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OrderDocumentStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order_id' => ['nullable', 'exists:orders,id'],
            'document_path' => ['required', 'string', 'max:255'],
            'document_type' => ['required', Rule::in(['proposal','terms','attachments'])],
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
