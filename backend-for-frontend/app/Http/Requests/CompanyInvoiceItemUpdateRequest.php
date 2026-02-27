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
            'project_phase_id' => [
                'sometimes',
                'required',
                'exists:project_phases,id',
                function ($attribute, $value, $fail) {
                    $phase = ProjectPhase::find($value);
                    if (!$phase) {
                        return;
                    }

                    if ($phase->status !== 'complete' || (float) $phase->progress_percentage < 100.0) {
                        $fail('The selected project phase must be in complete status with 100% progress before invoicing.');
                    }

                    $query = CompanyInvoiceItem::where('project_phase_id', $value);
                    if ($this->route('company_invoice_item')) {
                        $query->where('id', '!=', $this->route('company_invoice_item')->id ?? $this->route('company_invoice_item'));
                    }
                    if ($query->exists()) {
                        $fail('This project phase has already been invoiced. Only one company invoice item is allowed per phase.');
                    }
                },
            ],
            'item_name' => ['sometimes', 'required', 'string', 'max:255'],
            'item_description' => ['sometimes', 'nullable', 'string', 'max:255'],
            'item_amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'is_taxable' => ['sometimes', 'required', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
