<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CustDebitNoteDocumentStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'debit_note_id' => ['required', 'exists:cust_debit_notes,id'],
            'document_file' => ['required', 'file', 'mimes:pdf,doc,docx,xls,xlsx,jpg,jpeg,png,gif', 'max:5120'],
        ];
    }
}
