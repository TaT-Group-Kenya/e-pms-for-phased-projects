<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProjectOwnerUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'nullable', 'email', 'max:255'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:255'],
            'contact_person_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'logo' => ['nullable', 'image', 'mimes:jpeg,jpg,png', 'max:3072'],
            'description' => ['sometimes', 'nullable', 'string', 'max:255'],
            'address' => ['sometimes', 'nullable', 'string', 'max:255'],
            'city' => ['sometimes', 'nullable', 'string', 'max:255'],
            'state' => ['sometimes', 'nullable', 'string', 'max:255'],
            'country' => ['sometimes', 'nullable', 'string', 'max:255'],
            'kra_pin' => ['sometimes', 'nullable', 'string', 'max:255'],
            'customer_id' => ['sometimes', 'nullable', 'exists:customers,id'],
            'project_owner_id' => ['sometimes', 'nullable', 'exists:project_owners,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'logo.image' => 'The logo must be a valid image file.',
            'logo.mimes' => 'The logo must be one of: jpeg, jpg, png.',
            'logo.max' => 'The logo must not exceed 3MB.',
        ];
    }
}
