<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class QuoteLineItemUpdateRequest extends FormRequest
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
            'phase_name' => ['sometimes', 'required', 'string', 'max:255'],
            'phase_description' => ['sometimes', 'required', 'string', 'max:255'],
            'quoted_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'estimated_hours_nullable' => ['sometimes', 'required', 'string', 'max:255'],
            'custom_note' => ['sometimes', 'required', 'string', 'max:255'],
            'is_taxable' => ['sometimes', 'required', 'boolean'],
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
