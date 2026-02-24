<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProjectPhaseStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'project_id' => ['required', 'exists:projects,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'phase_order' => ['required', 'string', 'max:255'],
            'status' => ['required', Rule::in(['new', 'progress', 'draft', 'complete'])],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
            'progress_percentage' => ['required', 'string', 'max:255'],
            'quote_item_id' => ['nullable', 'exists:quote_items,id'],
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
