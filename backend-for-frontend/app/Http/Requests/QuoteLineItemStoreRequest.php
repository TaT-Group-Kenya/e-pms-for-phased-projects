<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class QuoteLineItemStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'quotation_id' => ['nullable', 'exists:quotations,id'],
            'project_phase_id' => ['nullable', 'exists:project_phases,id'],
            'phase_name' => ['required', 'string', 'max:255'],
            'phase_description' => ['required', 'string', 'max:255'],
            'quoted_amount' => ['required', 'numeric', 'min:0'],
            'estimated_hours_nullable' => ['required', 'string', 'max:255'],
            'custom_note' => ['required', 'string', 'max:255'],
            'is_taxable' => ['required', 'boolean'],
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
