<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProjectStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order_id' => ['required', 'exists:orders,id'],
            'job_reference_id' => ['nullable', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['string', 'max:255'],
            'customer_id' => ['required', 'exists:customers,id'],
            'project_category_id' => ['required', 'exists:project_categories,id'],
            'project_source_origin_id' => ['nullable', 'exists:project_source_origins,id'],
            'project_location_id' => ['nullable', 'exists:project_locations,id'],
            'no_of_phases' => ['required', 'string', 'max:255'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
            'budget_estimate' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', 'max:255'],
            'priority' => ['required', 'string', 'max:255'],
            'progress' => ['required', 'string', 'max:255'],
            'tags' => ['nullable', 'string', 'max:255'],
            'currency' => ['required', 'string', 'max:255'],
            'created_at' => ['nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
