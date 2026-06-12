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
        \Log::info("=== Step 1: Getting user group IDs for user {$user->id} ===");
        
        // Step 1: Get the user group IDs from the user_groups table
        $userGroups = \DB::table('user_groups')
            ->where('user_id', $user->id)
            ->where('is_deleted', false)
            ->pluck('id')
            ->toArray();
        
        \Log::info("Step 1 Result: User has " . count($userGroups) . " groups with IDs: " . json_encode($userGroups));
        
        if (count($userGroups) === 0) {
            \Log::warning("Step 1 Warning: User {$user->id} has no groups assigned");
            return false;
        }
        
        \Log::info("=== Step 2: Fetching group_roles where group_id IN (" . implode(',', $userGroups) . ") and is_deleted=false ===");
        
        // Step 2: Fetch from group_roles table where group_id matches and is_deleted=false
        $groupRoles = \DB::table('group_roles')
            ->whereIn('group_id', $userGroups)
            ->where('is_deleted', false)
            ->get();
        
        \Log::info("Step 2 Result: Found " . count($groupRoles) . " group_roles records");
        
        if (count($groupRoles) === 0) {
            \Log::warning("Step 2 Warning: No group_roles found for user's groups");
            return false;
        }
        
        // Collect role_ids from group_roles results
        $roleIds = $groupRoles->pluck('role_id')->toArray();
        \Log::info("Step 2 Result: Collected role_ids: " . json_encode($roleIds));
        
        \Log::info("=== Step 3: Fetching Role names from sys_roles table where id IN (" . implode(',', $roleIds) . ") ===");
        
        // Step 3: Fetch Role names from sys_roles table using the role_ids
        $roles = \DB::table('sys_roles')
            ->whereIn('id', $roleIds)
            ->where('is_deleted', false)
            ->get();
        
        \Log::info("Step 3 Result: Found " . count($roles) . " roles from sys_roles");
        
        // Get the role names as an array
        $roleNames = $roles->pluck('name')->toArray();
        \Log::info("Step 3 Result: Role names: " . json_encode($roleNames));
        
        // Check if the required role name exists
        if (in_array($roleName, $roleNames)) {
            \Log::info("Step 3 Result: [ROLE_FOUND] {$roleName}");
            return true;
        }
        
        \Log::warning("Step 3 Result: [ROLE_NOT_FOUND] {$roleName} not in user's roles");
        return false;
    }
}
