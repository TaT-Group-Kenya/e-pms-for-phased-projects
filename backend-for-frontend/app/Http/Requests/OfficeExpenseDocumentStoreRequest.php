<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OfficeExpenseDocumentStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'expense_id' => 'required|exists:office_expenses,id',
            'document_file' => 'required|file|mimes:jpeg,jpg,png,pdf,doc,docx|max:10240',
        ];
    }

    public function messages(): array
    {
        return [
            'expense_id.required' => 'The expense ID is required.',
            'expense_id.exists' => 'The selected expense is invalid.',
            'document_file.required' => 'Please select a document to upload.',
            'document_file.file' => 'The uploaded item must be a file.',
            'document_file.mimes' => 'Only images (JPG, PNG), PDF, DOC, and DOCX files are allowed.',
            'document_file.max' => 'The document size must not exceed 10MB.',
        ];
    }
}
