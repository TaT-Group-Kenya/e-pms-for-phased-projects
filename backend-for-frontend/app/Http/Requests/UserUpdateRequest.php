<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $routeUser = $this->route('user');
        $exceptId = null;
        if (is_object($routeUser) && property_exists($routeUser, 'id')) {
            $exceptId = $routeUser->id;
        } else {
            $exceptId = $routeUser;
        }
        \Log::debug('UserUpdateRequest rules', ['route_user' => $routeUser, 'except_id' => $exceptId]);

        return [
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('users','email')->ignore($exceptId)],
            'first_name' => ['sometimes', 'string', 'max:255'],
            'middle_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'last_name' => ['sometimes', 'string', 'max:255'],
            'password' => ['sometimes', 'nullable', 'string', 'min:6', 'max:255'],
            'email_verified_at' => ['sometimes', 'nullable', 'date'],
            'remember_token' => ['sometimes', 'nullable', 'string', 'max:255'],
            'avatar_pic' => ['sometimes', 'nullable', 'string', 'max:255'],
            'category' => ['sometimes', Rule::in(['internal','company','customer'])],
            'is_active' => ['sometimes', 'boolean'],
            'company_id' => ['sometimes', 'nullable', 'exists:companies,id'],
            'customer_id' => ['sometimes', 'nullable', 'exists:customers,id'],
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
