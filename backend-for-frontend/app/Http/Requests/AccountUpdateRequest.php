<?php

namespace App\Http\Requests;

use App\Models\Account;
use App\Models\ChartOfAccount;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AccountUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('accounts')->ignore(
                $this->route('account')
            )],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string', 'max:255'],
            'type' => ['sometimes', 'required', Rule::in(['cash', 'mpesa', 'bank'])],
            'group' => ['sometimes', 'required', Rule::in(['Petty', 'Checking', 'Savings', 'Loans'])],
            // currency and balance are controlled by the backend and cannot be changed via update
            'currency' => ['sometimes', 'string', 'max:10', 'exists:currencies,code'],
            'balance' => ['sometimes', 'numeric', 'max:100000000000000'],
            'overdraft_allowed' => ['sometimes', 'required', 'numeric', 'max:1'],
            'chart_of_account_id' => ['sometimes', 'required', 'integer', 'exists:chart_of_accounts,id'],
        ];
    }

    public function withValidator($validator)
    {
        // A Loans account is a loan obligation, so it can only be linked to
        // the Liabilities (2000) or Equity (3000) chart of accounts. The
        // group/chart pair is validated against the stored account when
        // either value is only being changed on one side.
        $validator->after(function ($validator) {
            $group = $this->input('group');
            $chartOfAccountId = $this->input('chart_of_account_id');

            $account = $this->route('account');

            if ($group === null && $account) {
                if (! $account instanceof Account) {
                    $account = Account::find($account);
                }
                $group = $account?->group;
            }

            if ($chartOfAccountId === null && $account) {
                if (! $account instanceof Account) {
                    $account = Account::find($account);
                }
                $chartOfAccountId = $account?->chart_of_account_id;
            }

            if ($group !== 'Loans' || ! $chartOfAccountId) {
                return;
            }

            $chartCode = ChartOfAccount::find($chartOfAccountId)?->code;

            if (! in_array($chartCode, ['2000', '3000'], true)) {
                $validator->errors()->add(
                    'chart_of_account_id',
                    'A Loans account can only be linked to the Liabilities (2000) or Equity (3000) chart of accounts.'
                );
            }
        });
    }

    public function messages(): array
    {
        return [
            // Add custom messages here if needed
        ];
    }
}
