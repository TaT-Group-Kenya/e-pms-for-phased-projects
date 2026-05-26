<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SysConfigStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isFile = $this->boolean('is_file') || $this->hasFile('value');

        return [
            'name' => ['required', 'string', 'max:255'],
            'is_file' => ['sometimes', 'boolean'],
            'value' => array_filter([
                'required',
                $isFile ? 'file' : 'string',
                $isFile ? 'image' : 'max:65535',
                $isFile ? 'max:8192' : null,
            ]),
        ];
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
