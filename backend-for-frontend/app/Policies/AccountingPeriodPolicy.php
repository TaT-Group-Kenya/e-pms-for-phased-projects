<?php

namespace App\Policies;

use App\Models\AccountingPeriod;
use App\Models\User;

class AccountingPeriodPolicy extends BaseModelPolicy
{
    /** No ROLE_ADD_/ROLE_DELETE_ variants: periods are never created/deleted via API. */
    protected $roleBase = 'ACCOUNTING_PERIOD';

    public function viewAny(User $user, $model = null): bool
    {
        return $this->check($user, 'VIEW', 'ACCOUNTING_PERIOD');
    }

    public function view(User $user, $model = null): bool
    {
        return $this->check($user, 'VIEW', 'ACCOUNTING_PERIOD');
    }

    /** Month-end review and close duty. */
    public function close(User $user, $model = null): bool
    {
        return $this->check($user, 'CLOSE', 'ACCOUNTING_PERIOD');
    }

    /** Controlled reopening (administrator). */
    public function reopen(User $user, $model = null): bool
    {
        return $this->check($user, 'REOPEN', 'ACCOUNTING_PERIOD');
    }
}
