<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SysConfigUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $hasFile = $this->hasFile('value');
        $isFile = $this->boolean('is_file') || $hasFile;

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'is_file' => ['sometimes', 'boolean'],
            'value' => array_filter([
                'sometimes',
                'required',
                $isFile ? ($hasFile ? 'file' : 'string') : 'string',
                $isFile ? ($hasFile ? 'image' : 'max:65535') : 'max:65535',
                $isFile && $hasFile ? 'max:8192' : null,
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
