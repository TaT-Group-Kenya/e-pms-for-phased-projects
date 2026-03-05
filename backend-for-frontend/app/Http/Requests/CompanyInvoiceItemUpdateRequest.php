<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\CompanyInvoiceItem;
use App\Models\ProjectPhase;

class CompanyInvoiceItemUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'invoice_id' => ['sometimes', 'required', 'exists:company_invoices,id'],
            'project_phase_id' => ['sometimes', 'nullable', 'exists:project_phases,id'],
            'item_name' => ['sometimes', 'required', 'string', 'max:255'],
            'item_description' => ['sometimes', 'nullable', 'string', 'max:255'],
            'item_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'is_taxable' => ['sometimes', 'required', 'boolean'],
            'tax_id' => ['sometimes', 'nullable', 'integer', 'exists:taxes,id'],
            'tax_item_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'item_type' => ['sometimes', 'nullable', 'string', 'max:255', Rule::in(['fixed', 'percent'])],
            'item_value' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'tax_amount' => ['sometimes', 'nullable', 'numeric', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
