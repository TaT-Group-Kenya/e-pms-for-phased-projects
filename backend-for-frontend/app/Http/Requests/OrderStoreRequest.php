<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'quotation_id' => ['required', 'exists:quotations,id'],
            // bol_number is derived from the quotation's linked ship container
            'bol_number' => ['nullable', 'string', 'max:255'],
            'ship_container_id' => ['nullable', 'exists:ship_containers,id'],
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'payment_terms' => ['nullable', 'string', 'max:255'],
            'notes_to_customer' => ['nullable', 'string', 'max:1000'],
            'created_at' => ['required', 'date'],
            'project_owner_id' => ['nullable', 'exists:project_owners,id'],
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
