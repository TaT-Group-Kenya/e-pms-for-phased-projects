<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CustDebitNoteDocumentUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'debit_note_id' => ['prohibited'],
            'document_file' => ['sometimes', 'required', 'file', 'mimes:pdf,doc,docx,xls,xlsx,jpg,jpeg,png,gif', 'max:5120'],
        ];
    }
}
