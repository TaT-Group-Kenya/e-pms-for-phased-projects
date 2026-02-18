<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CountryStoreRequest extends FormRequest
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
