<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SysConfigStoreRequest extends FormRequest
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
