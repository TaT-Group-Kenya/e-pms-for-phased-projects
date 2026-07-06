<?php

namespace App\Policies;

use App\Models\OfficeExpenseDocument;
use App\Models\User;

class OfficeExpenseDocumentPolicy extends BaseModelPolicy
{
    public function create(User $user, $model = null)
    {
        // Allow if user has ROLE_ADD_OFFICE_EXPENSE (since documents are tied to expenses)
        return $this->check($user, 'ADD', 'OFFICE_EXPENSE');
    }

    public function view(User $user, $model = null)
    {
        // Allow if user has ROLE_VIEW_OFFICE_EXPENSE (since documents are tied to expenses)
        return $this->check($user, 'VIEW', 'OFFICE_EXPENSE');
    }

    public function delete(User $user, $model = null)
    {
        // Allow if user has ROLE_DELETE_OFFICE_EXPENSE (since documents are tied to expenses)
        return $this->check($user, 'DELETE', 'OFFICE_EXPENSE');
    }
}
