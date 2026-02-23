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
        // If no model provided, derive from policy class name (e.g., CountryPolicy -> Country)
        if (!$model) {
            $policyClass = class_basename(get_class($this));
            $model = str_replace('Policy', '', $policyClass);
        }
        return $this->check($user, 'VIEW', $model);
    }
    
    public function view(User $user, $model)
    {
        return $this->check($user, 'VIEW', $model);
    }
    
    public function create(User $user, $model = null)
    {
        // If no model provided, derive from policy class name (e.g., CountryPolicy -> Country)
        if (!$model) {
            $policyClass = class_basename(get_class($this));
            $model = str_replace('Policy', '', $policyClass);
        }
        return $this->check($user, 'ADD', $model);
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
        \Log::info("Policy: Checking role {$roleName} for user {$user->id}");
        
        // First, try to load groups with roles if not already loaded
        if (!$user->relationLoaded('groups')) {
            \Log::info("Policy: Groups not loaded, loading...");
            try {
                $user->load('groups.roles');
            } catch (\Throwable $e) {
                \Log::error("Policy: Error loading groups: " . $e->getMessage());
                return false;
            }
        }
        
        $groups = $user->groups;
        \Log::info("Policy: User has " . count($groups) . " groups");
        
        if (count($groups) === 0) {
            \Log::warning("Policy: User {$user->id} has no groups assigned");
            return false;
        }
        
        // Check each group for the required role
        foreach ($groups as $group) {
            // Ensure roles are loaded
            if (!$group->relationLoaded('roles')) {
                try {
                    $group->load('roles');
                } catch (\Throwable $e) {
                    \Log::warning("Policy: Error loading roles for group {$group->id}: " . $e->getMessage());
                    continue;
                }
            }
            
            $roles = $group->roles;
            $roleNames = $roles->pluck('name')->toArray();
            \Log::info("Policy: Group {$group->id} has roles: " . json_encode($roleNames));
            
            if (in_array($roleName, $roleNames)) {
                \Log::info("Policy: [ROLE_FOUND] {$roleName}");
                return true;
            }
        }
        
        \Log::warning("Policy: [ROLE_NOT_FOUND] {$roleName} not in user's groups");
        return false;
    }
}
