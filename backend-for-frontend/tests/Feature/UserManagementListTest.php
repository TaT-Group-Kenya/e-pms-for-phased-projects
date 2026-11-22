<?php

namespace Tests\Feature;

use App\Models\SysGroup;
use App\Models\SysRole;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Tests\TestCase;

/**
 * Server-side listing behaviour for the User Management tabs: pagination,
 * whitelisted free-text search and equality filters on /users, /sys-groups
 * and /sys-roles. The front-end tabs drive these endpoints page by page.
 */
class UserManagementListTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->dropAllTables();
        $this->createSchema();
        $this->authorizeAll();
    }

    protected function tearDown(): void
    {
        $this->dropAllTables();

        parent::tearDown();
    }

    private function dropAllTables(): void
    {
        foreach ([
            'user_groups',
            'group_roles',
            'sys_roles',
            'sys_groups',
            'users',
            'sys_configs',
        ] as $table) {
            \Schema::dropIfExists($table);
        }
    }

    private function createSchema(): void
    {
        \Schema::create('users', function ($t) {
            $t->id();
            $t->timestamps();
            $t->string('email');
            $t->string('first_name');
            $t->string('middle_name')->nullable();
            $t->string('last_name');
            $t->string('password')->nullable();
            $t->unsignedBigInteger('updated_by')->nullable();
            $t->unsignedBigInteger('created_by')->nullable();
            $t->string('remember_token')->nullable();
            $t->string('avatar_pic')->nullable();
            $t->string('category');
            $t->boolean('is_active');
            $t->unsignedBigInteger('company_id')->nullable();
            $t->unsignedBigInteger('customer_id')->nullable();
            $t->boolean('is_deleted')->default(false);
            $t->timestamp('deleted_at')->nullable();
            $t->unsignedBigInteger('deleted_by')->nullable();
        });
        \Schema::create('sys_groups', function ($t) {
            $t->id();
            $t->string('name');
            $t->text('description')->nullable();
            $t->timestamps();
            $t->unsignedBigInteger('created_by')->nullable();
            $t->unsignedBigInteger('updated_by')->nullable();
            $t->boolean('is_deleted')->default(false);
            $t->timestamp('deleted_at')->nullable();
            $t->unsignedBigInteger('deleted_by')->nullable();
        });
        \Schema::create('sys_roles', function ($t) {
            $t->id();
            $t->string('name');
            $t->text('description')->nullable();
            $t->timestamps();
            $t->unsignedBigInteger('created_by')->nullable();
            $t->unsignedBigInteger('updated_by')->nullable();
            $t->boolean('is_deleted')->default(false);
            $t->timestamp('deleted_at')->nullable();
            $t->unsignedBigInteger('deleted_by')->nullable();
        });
        \Schema::create('group_roles', function ($t) {
            $t->id();
            $t->unsignedBigInteger('group_id');
            $t->unsignedBigInteger('role_id');
            $t->timestamps();
            $t->unsignedBigInteger('created_by')->nullable();
            $t->unsignedBigInteger('updated_by')->nullable();
            $t->boolean('is_deleted')->default(false);
            $t->timestamp('deleted_at')->nullable();
            $t->unsignedBigInteger('deleted_by')->nullable();
        });
        \Schema::create('user_groups', function ($t) {
            $t->id();
            $t->unsignedBigInteger('user_id');
            $t->unsignedBigInteger('sys_group_id');
            $t->timestamps();
            $t->unsignedBigInteger('created_by')->nullable();
            $t->unsignedBigInteger('updated_by')->nullable();
            $t->boolean('is_deleted')->default(false);
            $t->timestamp('deleted_at')->nullable();
            $t->unsignedBigInteger('deleted_by')->nullable();
        });
        // UserResource reads SESSION_MAX_LIMIT_IN_MINUTES from sys_configs.
        \Schema::create('sys_configs', function ($t) {
            $t->id();
            $t->timestamps();
            $t->string('name');
            $t->text('value');
        });
    }

    private function authorizeAll(): void
    {
        Gate::before(fn () => true);
        $user = new User;
        $user->id = 1;
        $this->actingAs($user, 'sanctum');
    }

    private function makeUser(string $firstName, string $lastName, string $email, string $category = 'internal', bool $active = true): User
    {
        return User::create([
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $email,
            'category' => $category,
            'is_active' => $active,
        ]);
    }

    private function makeGroup(string $name, ?string $description = null): SysGroup
    {
        return SysGroup::create([
            'name' => $name,
            'description' => $description,
        ]);
    }

    private function makeRole(string $name, ?string $description = null): SysRole
    {
        return SysRole::create([
            'name' => $name,
            'description' => $description,
        ]);
    }

    public function test_users_search_matches_names_and_email(): void
    {
        $this->makeUser('Alice', 'Wanjiku', 'alice@example.com');
        $this->makeUser('Bob', 'Otieno', 'bob@example.com');

        $response = $this->getJson('/e-pms/api/v1/users?search=Otieno');
        $response->assertOk();
        $body = $response->json();

        $this->assertSame(1, $body['meta']['total']);
        $this->assertSame('Bob', $body['data'][0]['first_name']);

        $byEmail = $this->getJson('/e-pms/api/v1/users?search=alice@');
        $byEmail->assertOk();
        $this->assertSame(1, $byEmail->json('meta.total'));
        $this->assertSame('Alice', $byEmail->json('data.0.first_name'));

        // No hits -> empty page, still 200
        $none = $this->getJson('/e-pms/api/v1/users?search=zzz');
        $none->assertOk();
        $this->assertSame(0, $none->json('meta.total'));
        $this->assertSame([], $none->json('data'));
    }

    public function test_users_category_and_active_filters(): void
    {
        $internal = $this->makeUser('Ada', 'Lovelace', 'ada@example.com', 'internal', true);
        $company = $this->makeUser('Carl', 'Company', 'carl@example.com', 'company', false);
        $this->makeUser('Dana', 'Customer', 'dana@example.com', 'customer', true);

        $companyOnly = $this->getJson('/e-pms/api/v1/users?category=company');
        $companyOnly->assertOk();
        $this->assertSame(1, $companyOnly->json('meta.total'));
        $this->assertSame('company', $companyOnly->json('data.0.category'));

        $inactive = $this->getJson('/e-pms/api/v1/users?is_active=0');
        $inactive->assertOk();
        $this->assertSame(1, $inactive->json('meta.total'));
        $this->assertSame($company->id, $inactive->json('data.0.id'));

        $combined = $this->getJson('/e-pms/api/v1/users?category=customer&is_active=1');
        $combined->assertOk();
        $this->assertNotEquals($internal->id, $combined->json('data.0.id'));
        $this->assertSame('customer', $combined->json('data.0.category'));
    }

    public function test_users_are_paginated(): void
    {
        for ($i = 1; $i <= 4; $i++) {
            $this->makeUser('User'.$i, 'Batch', 'batch'.$i.'@example.com');
        }

        $page1 = $this->getJson('/e-pms/api/v1/users?page=1&per_page=3');
        $page1->assertOk();
        $meta = $page1->json('meta');
        $this->assertSame(4, $meta['total'] ?? $page1->json('total'));
        $this->assertSame(3, $meta['per_page'] ?? 3);
        $this->assertSame(1, $meta['current_page'] ?? 1);
        $this->assertCount(3, $page1->json('data'));

        $page2 = $this->getJson('/e-pms/api/v1/users?page=2&per_page=3');
        $page2->assertOk();
        $this->assertCount(1, $page2->json('data'));
    }

    public function test_users_with_deleted_flag_includes_deleted_rows(): void
    {
        $user = $this->makeUser('Ghost', 'Row', 'ghost@example.com');
        $user->softDelete();

        $visible = $this->getJson('/e-pms/api/v1/users');
        $visible->assertOk();
        $this->assertSame(0, $visible->json('meta.total'));

        $all = $this->getJson('/e-pms/api/v1/users?with_deleted=1');
        $all->assertOk();
        $this->assertSame(1, $all->json('meta.total'));
    }

    public function test_users_unknown_filter_is_ignored(): void
    {
        $this->makeUser('Valid', 'User', 'valid@example.com');

        $response = $this->getJson('/e-pms/api/v1/users?nonexistent_column=1');
        $response->assertOk();
        $this->assertSame(1, $response->json('meta.total'));
    }

    public function test_groups_search_and_ordering(): void
    {
        $alpha = $this->makeGroup('Alpha Finance', 'Money matters');
        $this->makeGroup('Beta Ops', 'Operations');
        $this->makeGroup('Gamma', null);

        $search = $this->getJson('/e-pms/api/v1/sys-groups?search=operations');
        $search->assertOk();
        $this->assertSame(1, $search->json('meta.total'));
        $this->assertSame('Beta Ops', $search->json('data.0.name'));

        $all = $this->getJson('/e-pms/api/v1/sys-groups');
        $all->assertOk();
        $names = array_column($all->json('data'), 'name');
        $this->assertSame(['Alpha Finance', 'Beta Ops', 'Gamma'], $names);
        $this->assertSame(3, $all->json('meta.total'));
        $this->assertSame($alpha->id, $all->json('data.0.id'));
    }

    public function test_roles_search_and_pagination(): void
    {
        foreach (['ROLE_VIEW_USER', 'ROLE_ADD_USER', 'ROLE_EDIT_USER', 'ROLE_DELETE_USER'] as $name) {
            $this->makeRole($name, 'Permission role');
        }

        $search = $this->getJson('/e-pms/api/v1/sys-roles?search=view_user');
        $search->assertOk();
        $this->assertSame(1, $search->json('meta.total'));
        $this->assertSame('ROLE_VIEW_USER', $search->json('data.0.name'));

        $page = $this->getJson('/e-pms/api/v1/sys-roles?page=2&per_page=3');
        $page->assertOk();
        $this->assertSame(4, $page->json('meta.total'));
        $this->assertCount(1, $page->json('data'));
    }

    public function test_group_roles_join_tables_still_resolve_for_auth(): void
    {
        $user = $this->makeUser('Role', 'Holder', 'role-holder@example.com');
        $group = $this->makeGroup('Group A');
        $role = $this->makeRole('ROLE_VIEW_USER');
        DB::table('user_groups')->insert(['user_id' => $user->id, 'sys_group_id' => $group->id]);
        DB::table('group_roles')->insert(['group_id' => $group->id, 'role_id' => $role->id]);

        $loaded = User::with('groups.roles')->find($user->id);
        $this->assertSame('Group A', $loaded->groups->first()->name);
        $this->assertTrue($loaded->groups->first()->roles->contains('id', $role->id));
    }
}
