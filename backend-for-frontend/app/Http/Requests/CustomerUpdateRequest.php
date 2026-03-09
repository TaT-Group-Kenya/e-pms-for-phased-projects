<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CustomerUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255'],
            'phone' => ['sometimes', 'required', 'string', 'max:255'],
            'contact_person_name' => ['sometimes', 'required', 'string', 'max:255'],
            'logo' => ['nullable', 'image', 'mimes:jpeg,jpg,png', 'max:3072'],
            'address' => ['sometimes', 'required', 'string', 'max:255'],
            'city' => ['sometimes', 'required', 'string', 'max:255'],
            'state' => ['sometimes', 'required', 'string', 'max:255'],
            'country' => ['sometimes', 'required', 'string', 'max:255'],
            'kra_pin' => ['sometimes', 'required', 'string', 'max:255'],
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
