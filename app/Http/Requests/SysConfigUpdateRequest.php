<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SysConfigUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
        ];
    }
}
