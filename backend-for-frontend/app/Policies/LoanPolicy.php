<?php

namespace App\Policies;

class LoanPolicy extends BaseModelPolicy
{
    /**
     * Loans use the dedicated LOAN permission set (ROLE_VIEW_LOAN,
     * ROLE_ADD_LOAN, ROLE_EDIT_LOAN, ROLE_DELETE_LOAN).
     */
    protected $roleBase = 'LOAN';
}
