<?php

namespace Tests\Feature;

use App\Models\Currency;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

/**
 * Authorization denials must tell the user which ROLE_* permission to
 * request instead of the framework's generic "This action is unauthorized."
 *
 * Tables are created manually (see AccountingPeriodApiTest) because the
 * full migration set is not runnable on the SQLite test database.
 */
class DescriptiveAuthorizationErrorTest extends TestCase
{
    private function dropSchema(): void
    {
        foreach ([
            'personal_access_tokens',
            'currencies',
            'group_roles',
            'user_groups',
            'sys_roles',
            'sys_groups',
            'users',
        ] as $table) {
            Schema::dropIfExists($table);
        }
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->dropSchema();

        Schema::create('users', function ($t) {
            $t->id();
            $t->timestamps();
            $t->string('email');
            $t->string('first_name');
            $t->string('last_name');
            $t->string('password');
            $t->timestamp('email_verified_at')->nullable();
            $t->unsignedBigInteger('updated_by')->nullable();
            $t->unsignedBigInteger('created_by')->nullable();
            $t->string('remember_token')->nullable();
            $t->string('avatar_pic')->nullable();
            $t->string('category')->default('internal');
            $t->boolean('is_active')->default(true);
            $t->unsignedBigInteger('company_id')->nullable();
            $t->unsignedBigInteger('customer_id')->nullable();
            $t->boolean('is_deleted')->default(false);
            $t->timestamp('deleted_at')->nullable();
            $t->unsignedBigInteger('deleted_by')->nullable();
        });
        foreach (['sys_groups', 'sys_roles'] as $table) {
            Schema::create($table, function ($t) {
                $t->id();
                $t->string('name')->nullable();
                $t->text('description')->nullable();
                $t->timestamps();
                $t->unsignedBigInteger('created_by')->nullable();
                $t->unsignedBigInteger('updated_by')->nullable();
                $t->boolean('is_deleted')->default(false);
                $t->timestamp('deleted_at')->nullable();
                $t->unsignedBigInteger('deleted_by')->nullable();
            });
        }
        Schema::create('group_roles', function ($t) {
            $t->id();
            $t->unsignedBigInteger('group_id');
            $t->unsignedBigInteger('role_id');
            $t->timestamps();
            $t->unsignedBigInteger('created_by')->nullable();
            $t->unsignedBigInteger('updated_by')->nullable();
            $t->boolean('is_deleted')->default(false);
        });
        Schema::create('user_groups', function ($t) {
            $t->id();
            $t->unsignedBigInteger('user_id');
            $t->unsignedBigInteger('sys_group_id');
            $t->timestamps();
            $t->unsignedBigInteger('created_by')->nullable();
            $t->unsignedBigInteger('updated_by')->nullable();
            $t->boolean('is_deleted')->default(false);
        });
        Schema::create('personal_access_tokens', function ($t) {
            $t->id();
            $t->morphs('tokenable');
            $t->string('name')->nullable();
            $t->string('token', 64)->unique();
            $t->text('abilities')->nullable();
            $t->timestamp('last_used_at')->nullable();
            $t->timestamp('expires_at')->nullable();
            $t->timestamps();
        });
        Schema::create('currencies', function ($t) {
            $t->id();
            $t->string('code');
            $t->string('name');
            $t->text('description')->nullable();
            $t->decimal('current_forex_rate', 18, 6)->default(1);
            $t->timestamps();
            $t->unsignedBigInteger('created_by')->nullable();
            $t->unsignedBigInteger('updated_by')->nullable();
            $t->boolean('is_deleted')->default(false);
            $t->timestamp('deleted_at')->nullable();
            $t->unsignedBigInteger('deleted_by')->nullable();
        });
    }

    protected function tearDown(): void
    {
        $this->dropSchema();

        parent::tearDown();
    }

    private function userWithRoles(array $roles): User
    {
        $user = User::create([
            'email' => uniqid('user-').'@example.test',
            'first_name' => 'Test',
            'last_name' => 'User',
            'password' => bcrypt('password123'),
            'category' => 'internal',
            'is_active' => true,
        ]);

        $groupId = DB::table('sys_groups')->insertGetId([
            'name' => 'G', 'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_groups')->insert([
            'user_id' => $user->id, 'sys_group_id' => $groupId,
        ]);
        foreach ($roles as $role) {
            $roleId = DB::table('sys_roles')->insertGetId([
                'name' => $role, 'created_at' => now(), 'updated_at' => now(),
            ]);
            DB::table('group_roles')->insert([
                'group_id' => $groupId, 'role_id' => $roleId,
            ]);
        }

        return $user;
    }

    private function authHeaders(User $user): array
    {
        return ['Authorization' => 'Bearer '.$user->createToken('tests')->plainTextToken];
    }

    public function test_currency_listing_denial_names_the_required_permission(): void
    {
        // No roles at all: every policy check is denied.
        $user = $this->userWithRoles([]);

        $response = $this->getJson(
            '/e-pms/api/v1/currencies',
            $this->authHeaders($user)
        );

        $response->assertStatus(403);
        $body = $response->json();
        $this->assertStringContainsString('ROLE_VIEW_CURRENCY', $body['message']);
        $this->assertStringNotContainsString('This action is unauthorized', $body['message']);
        $this->assertSame('authorization', $body['error_type']);
    }

    public function test_currency_listing_allowed_with_permission(): void
    {
        Currency::create(['code' => 'KES', 'name' => 'Kenyan Shilling', 'current_forex_rate' => 1]);

        $user = $this->userWithRoles(['ROLE_VIEW_CURRENCY']);

        $this->getJson(
            '/e-pms/api/v1/currencies',
            $this->authHeaders($user)
        )->assertStatus(200);
    }

    public function test_currency_creation_denial_names_the_add_permission(): void
    {
        $user = $this->userWithRoles(['ROLE_VIEW_CURRENCY']);

        $response = $this->postJson(
            '/e-pms/api/v1/currencies',
            [
                'code' => 'EUR',
                'name' => 'Euro',
                'description' => 'Euro',
                'current_forex_rate' => 130,
            ],
            $this->authHeaders($user)
        );

        $response->assertStatus(403);
        $this->assertStringContainsString('ROLE_ADD_CURRENCY', $response->json('message'));
    }

    public function test_denials_still_behave_as_boolean_for_gate_boolean_callers(): void
    {
        $user = $this->userWithRoles([]);

        $this->assertFalse(\Gate::forUser($user)->allows('viewAny', Currency::class));
        $this->assertTrue(\Gate::forUser($user)->denies('viewAny', Currency::class));
    }
}
