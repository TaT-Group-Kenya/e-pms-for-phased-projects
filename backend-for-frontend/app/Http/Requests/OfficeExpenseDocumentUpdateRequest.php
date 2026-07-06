<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OfficeExpenseDocumentUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'document_file' => 'nullable|file|mimes:jpeg,jpg,png,pdf,doc,docx|max:10240',
        ];
    }

    public function messages(): array
    {
        return [
            'document_file.file' => 'The uploaded item must be a file.',
            'document_file.mimes' => 'Only images (JPG, PNG), PDF, DOC, and DOCX files are allowed.',
            'document_file.max' => 'The document size must not exceed 10MB.',
        ];
    }
}
