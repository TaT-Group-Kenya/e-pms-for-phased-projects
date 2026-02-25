<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class QuoteApprovalStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'exists:users,id'],
            'quote_id' => ['required', 'exists:quotations,id'],
            'action' => ['required', Rule::in(['make', 'check'])],
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'User is required',
            'user_id.exists' => 'The selected user does not exist',
            'quote_id.required' => 'Quote is required',
            'quote_id.exists' => 'The selected quote does not exist',
            'action.required' => 'Action is required',
            'action.in' => 'Action must be either make or check',
        ];
    }
}
