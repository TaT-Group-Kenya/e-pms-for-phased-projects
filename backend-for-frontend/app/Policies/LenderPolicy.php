<?php

namespace App\Policies;

class LenderPolicy extends BaseModelPolicy
{
    /**
     * Lenders use the LOAN permission set (ROLE_VIEW_LOAN,
     * ROLE_ADD_LOAN, ROLE_EDIT_LOAN, ROLE_DELETE_LOAN), shared with the
     * loans module — no separate lender permissions exist.
     */
    protected $roleBase = 'LOAN';
}

