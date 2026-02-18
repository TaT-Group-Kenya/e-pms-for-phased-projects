<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class BaseModelPolicy
{
    use HandlesAuthorization;

    /**
     * Optional explicit role base for the policy (e.g. 'USER', 'PROJECT').
     * If null, `roleBaseFromModel()` will be used.
     *
     * @var string|null
     */
    protected $roleBase = null;

    protected function roleBaseFromModel($model)
    {
        $class = is_object($model) ? get_class($model) : (string) $model;
        // If a fully-qualified class name was provided, use its basename.
        $short = class_basename($class);

        // Convert CamelCase / PascalCase to UPPER_SNAKE_CASE, e.g.
        // CustPaymentAllocation => CUST_PAYMENT_ALLOCATION
        $snake = preg_replace('/([a-z0-9])([A-Z])/', '$1_$2', $short);
        $snake = preg_replace('/([A-Z])([A-Z][a-z])/', '$1_$2', $snake);
        $snake = strtoupper($snake);
        return $snake;
    }

    protected function roleBase($model)
    {
        if (!empty($this->roleBase)) {
            return $this->roleBase;
        }
        return $this->roleBaseFromModel($model);
    }

    public function viewAny(User $user, $model = null)
    {
        if ($model) {
            return $this->check($user, 'VIEW', $model);
        }

        return false;
    }
    
    public function view(User $user, $model)
    {
        return $this->check($user, 'VIEW', $model);
    }
    public function create(User $user, $model = null)
    {
        if ($model) {
            return $this->check($user, 'ADD', $model);
        }

        return false;
    }

    public function update(User $user, $model)
    {
        return $this->check($user, 'EDIT', $model);
    }

    public function delete(User $user, $model)
    {
        return $this->check($user, 'DELETE', $model);
    }

    protected function check(User $user, $action, $model)
    {
        $base = $this->roleBase($model);
        $roleName = "ROLE_{$action}_{$base}";
        return $this->userHasRole($user, $roleName);
    }

    protected function userHasRole(User $user, string $roleName): bool
    {
        if (method_exists($user, 'roles')) {
            try {
                if ($user->roles()->pluck('name')->contains($roleName)) {
                    return true;
                }
            } catch (\Throwable $e) {
                // continue
            }
        }

        if (isset($user->roles) && $user->roles instanceof \Illuminate\Support\Collection) {
            if ($user->roles->pluck('name')->contains($roleName)) {
                return true;
            }
        }

        if (method_exists($user, 'groups')) {
            try {
                $groups = $user->groups()->with('roles')->get();
                foreach ($groups as $group) {
                    if (method_exists($group, 'roles') && $group->roles()->pluck('name')->contains($roleName)) {
                        return true;
                    }
                    if (isset($group->roles) && $group->roles instanceof \Illuminate\Support\Collection) {
                        if ($group->roles->pluck('name')->contains($roleName)) {
                            return true;
                        }
                    }
                }
            } catch (\Throwable $e) {
                // continue
            }
        }

        if (method_exists($user, 'userGroups')) {
            try {
                $groups = $user->userGroups()->with('roles')->get();
                foreach ($groups as $group) {
                    if (method_exists($group, 'roles') && $group->roles()->pluck('name')->contains($roleName)) {
                        return true;
                    }
                }
            } catch (\Throwable $e) {
                // continue
            }
        }

        return false;
    }
}
