<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\CompanyInvoiceItem;
use App\Models\ProjectPhase;

class CompanyInvoiceItemStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'invoice_id' => ['required', 'exists:company_invoices,id'],
            'project_phase_id' => [
                'required',
                'exists:project_phases,id',
                function ($attribute, $value, $fail) {
                    $phase = ProjectPhase::find($value);
                    if (!$phase) {
                        return;
                    }

                    // Require completed phase: status "complete" and 100% progress
                    if ($phase->status !== 'complete' || (float) $phase->progress_percentage < 100.0) {
                        $fail('The selected project phase must be in complete status with 100% progress before invoicing.');
                    }

                    if (CompanyInvoiceItem::where('project_phase_id', $value)->exists()) {
                        $fail('This project phase has already been invoiced. Only one company invoice item is allowed per phase.');
                    }
                },
            ],
            'item_name' => ['required', 'string', 'max:255'],
            'item_description' => ['nullable', 'string', 'max:255'],
            'item_amount' => ['required', 'numeric', 'min:0'],
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
