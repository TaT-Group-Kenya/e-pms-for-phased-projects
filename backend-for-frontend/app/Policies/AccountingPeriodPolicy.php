<?php

namespace App\Policies;

use App\Models\AccountingPeriod;
use App\Models\AccountingPeriodRequest;
use App\Models\User;

class AccountingPeriodPolicy extends BaseModelPolicy
{
    /** No ROLE_ADD_/ROLE_DELETE_ variants: periods are never created/deleted via API. */
    protected $roleBase = 'ACCOUNTING_PERIOD';

    public function viewAny(User $user, $model = null)
    {
        return $this->check($user, 'VIEW', 'ACCOUNTING_PERIOD');
    }

    public function view(User $user, $model = null)
    {
        return $this->check($user, 'VIEW', 'ACCOUNTING_PERIOD');
    }

    public function close(User $user, $model = null)
    {
        $close = $this->hasRoleFor($user, 'CLOSE');
        if ($close->allowed()) {
            return $close;
        }
        return $this->hasRoleFor($user, 'MAKER');
    }

    /** Controlled reopening (administrator) — direct reopen stays admin-only. */
    public function reopen(User $user, $model = null)
    {
        return $this->hasRoleFor($user, 'REOPEN');
    }

    /** Maker duty: submit new close/reopen requests. */
    public function make(User $user, $model = null)
    {
        return $this->hasRoleFor($user, 'MAKER');
    }

    /**
     * Checker duty: approve/reject pending requests (Gate ability "review").
     * The maker≠checker invariant is validated in the service.
     */
    public function review(User $user, ?AccountingPeriodRequest $request = null)
    {
        return $this->hasRoleFor($user, 'CHECKER');
    }

    /** Listing the request queue (makers see their own; checkers see all). */
    public function viewRequests(User $user)
    {
        $view = $this->hasRoleFor($user, 'VIEW');
        if ($view->allowed()) {
            return $view;
        }
        return $this->hasRoleFor($user, 'CHECKER');
    }

    /** Request model gates (queue + detail access). */
    public function viewAnyRequest(User $user, ?AccountingPeriodRequest $request = null)
    {
        return $this->viewRequests($user);
    }

    public function viewRequest(User $user, AccountingPeriodRequest $request)
    {
        return $this->viewRequests($user);
    }

    /** Cancel gate; own-pending-request rule enforced in the service. */
    public function cancel(User $user, ?AccountingPeriodRequest $request = null)
    {
        return $this->hasRoleFor($user, 'MAKER');
    }

    /** Policy-local role check distinct from BaseModelPolicy::check(). */
    protected function hasRoleFor(User $user, string $action)
    {
        return parent::check($user, $action, 'ACCOUNTING_PERIOD');
    }
}