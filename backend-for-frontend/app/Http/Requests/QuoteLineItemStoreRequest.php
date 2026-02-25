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
            'phase_description' => ['nullable', 'string', 'max:255'],
            'quoted_amount' => ['required', 'numeric', 'min:0'],
            'quantity' => ['required', 'integer', 'min:1'], // Allow optional quantity field
            'estimated_hours' => ['nullable', 'string', 'max:255'],
            'custom_note' => ['nullable', 'string', 'max:255'],
            'is_taxable' => ['required', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
