<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProjectProgressUpdateUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'project_id' => ['nullable', 'exists:projects,id'],
            'project_phase_id' => ['nullable', 'exists:project_phases,id'],
            'percentage_complete' => ['sometimes', 'numeric', 'max:100'],
            'comment' => ['sometimes', 'required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
