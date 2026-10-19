<?php

namespace Tests\Feature;

use App\Models\Account;
use App\Models\ChartOfAccount;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class ChartOfAccountTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Schema::dropIfExists('transactions');
        Schema::dropIfExists('accounts');
        Schema::dropIfExists('chart_of_accounts');
        Schema::dropIfExists('user_groups');
        Schema::dropIfExists('group_roles');
        Schema::dropIfExists('sys_roles');
        Schema::dropIfExists('sys_groups');
        Schema::dropIfExists('users');

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('email');
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('password');
            $table->timestamp('email_verified_at')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->string('remember_token')->nullable();
            $table->string('avatar_pic')->nullable();
            $table->string('category');
            $table->boolean('is_active');
            $table->unsignedBigInteger('company_id')->nullable();
            $table->unsignedBigInteger('customer_id')->nullable();
        });

        Schema::create('sys_groups', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });

        Schema::create('sys_roles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });

        Schema::create('group_roles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('group_id');
            $table->unsignedBigInteger('role_id');
            $table->timestamps();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });

        Schema::create('user_groups', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('sys_group_id');
            $table->timestamps();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });

        foreach ($this->standardRoleNames() as $roleName) {
            \App\Models\SysRole::create(['name' => $roleName]);
        }

        Schema::create('chart_of_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });

        foreach ($this->standardCharts() as $seed) {
            ChartOfAccount::create($seed);
        }

        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->string('code');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('type');
            $table->string('group');
            $table->string('currency', 10)->nullable();
            $table->decimal('balance', 15, 2)->default(0);
            $table->unsignedBigInteger('chart_of_account_id')->nullable();
            $table->boolean('overdraft_allowed')->default(false);
            $table->timestamps();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();

            $table->foreign('chart_of_account_id')->references('id')->on('chart_of_accounts');
        });

        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_number');
            $table->string('transaction_type');
            $table->date('transaction_date');
            $table->date('posted_date');
            $table->decimal('amount', 15, 2);
            $table->string('transaction_currency')->nullable();
            $table->string('base_currency')->nullable();
            $table->decimal('exchange_rate', 15, 6)->default(1);
            $table->decimal('converted_amount', 15, 2)->nullable();
            $table->decimal('converted_tax_amount', 15, 2)->nullable();
            $table->decimal('converted_net_amount', 15, 2)->nullable();
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('net_amount', 15, 2)->nullable();
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->unsignedBigInteger('company_id')->nullable();
            $table->string('source_type');
            $table->unsignedBigInteger('source_id')->nullable();
            $table->string('account_debit')->nullable();
            $table->string('account_credit')->nullable();
            $table->string('category')->nullable();
            $table->string('payment_method')->nullable();
            $table->string('bank_account')->nullable();
            $table->string('check_number')->nullable();
            $table->string('transaction_status')->nullable();
            $table->unsignedBigInteger('related_transaction_id')->nullable();
            $table->text('narration')->nullable();
            $table->boolean('is_recurring')->default(false);
            $table->string('fiscal_year')->nullable();
            $table->string('accounting_period')->nullable();
            $table->boolean('is_adjusting_entry')->default(false);
            $table->unsignedBigInteger('cost_center_id')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
            $table->boolean('is_deleted')->default(false);
            $table->timestamp('deleted_at')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
        });
    }

    protected function tearDown(): void
    {
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('accounts');
        Schema::dropIfExists('chart_of_accounts');
        Schema::dropIfExists('user_groups');
        Schema::dropIfExists('group_roles');
        Schema::dropIfExists('sys_roles');
        Schema::dropIfExists('sys_groups');
        Schema::dropIfExists('users');

        parent::tearDown();
    }

    private function standardRoleNames(): array
    {
        return [
            'ROLE_VIEW_ACCOUNT',
            'ROLE_ADD_ACCOUNT',
            'ROLE_EDIT_ACCOUNT',
            'ROLE_DELETE_ACCOUNT',
        ];
    }

    private function standardCharts(): array
    {
        return [
            ['code' => '1000', 'name' => 'Assets', 'description' => 'Assets'],
            ['code' => '2000', 'name' => 'Liabilities', 'description' => 'Liabilities'],
            ['code' => '3000', 'name' => 'Equity', 'description' => 'Equity'],
            ['code' => '4000', 'name' => 'Revenue/Income', 'description' => 'Revenue/Income'],
            ['code' => '5000', 'name' => 'Expenses', 'description' => 'Expenses'],
        ];
    }

    public function authorizeAll(): void
    {
        Gate::before(fn () => true);
        $user = new User;
        $user->id = 1;
        $this->actingAs($user, 'sanctum');
    }

    public function test_chart_of_accounts_are_seeded_with_standard_codes(): void
    {
        foreach ([
            '1000' => 'Assets',
            '2000' => 'Liabilities',
            '3000' => 'Equity',
            '4000' => 'Revenue/Income',
            '5000' => 'Expenses',
        ] as $code => $name) {
            $this->assertDatabaseHas('chart_of_accounts', ['code' => $code, 'name' => $name]);
        }
    }

    public function test_account_can_only_be_linked_to_one_chart_of_account(): void
    {
        $account = Account::create([
            'code' => 'INT-ACC-TEST-1',
            'name' => 'Loan account',
            'description' => 'Loan account',
            'type' => 'bank',
            'group' => 'Checking',
            'currency' => 'KES',
            'balance' => 0,
            'overdraft_allowed' => false,
            'chart_of_account_id' => ChartOfAccount::where('code', '2000')->value('id'),
        ]);

        $this->assertSame('Liabilities', $account->chartOfAccount->name);

        // Re-linking to another chart of account keeps a single link at a time.
        $account->update(['chart_of_account_id' => ChartOfAccount::where('code', '3000')->value('id')]);
        $account->refresh();

        $this->assertSame('Equity', $account->chartOfAccount->name);
    }

    public function test_accounts_index_loads_linked_chart_of_account(): void
    {
        Account::create([
            'code' => 'INT-ACC-TEST-2',
            'name' => 'Euro account',
            'description' => 'Euro account',
            'type' => 'bank',
            'group' => 'Checking',
            'currency' => 'EUR',
            'balance' => 100,
            'overdraft_allowed' => false,
            'chart_of_account_id' => ChartOfAccount::where('code', '1000')->value('id'),
        ]);

        $resource = new \App\Http\Resources\AccountResource(
            Account::with('chartOfAccount')->firstOrFail()
        );

        $payload = $resource->toArray(request());
        $this->assertSame('1000', $payload['chart_of_account']['code']);
        $this->assertSame('Assets', $payload['chart_of_account']['name']);
    }

    public function test_internal_topup_still_debits_source_account(): void
    {
        $this->authorizeAll();

        $source = Account::create([
            'code' => 'INT-ACC-SRC',
            'name' => 'Main account',
            'description' => 'Main account',
            'type' => 'bank',
            'group' => 'Checking',
            'currency' => 'KES',
            'balance' => 1000,
            'overdraft_allowed' => false,
            'chart_of_account_id' => ChartOfAccount::where('code', '1000')->value('id'),
        ]);

        $target = Account::create([
            'code' => 'INT-ACC-TRG',
            'name' => 'Euro account',
            'description' => 'Euro account',
            'type' => 'bank',
            'group' => 'Checking',
            'currency' => 'EUR',
            'balance' => 0,
            'overdraft_allowed' => false,
            'chart_of_account_id' => ChartOfAccount::where('code', '1000')->value('id'),
        ]);

        $response = $this->postJson('/e-pms/api/v1/accounts/'.$target->id.'/topup', [
            'source_type' => 'internal',
            'source_account_id' => $source->id,
            'source_debit_amount' => 100,
            'exchange_rate' => 0.8,
        ]);

        $response->assertOk();

        $source->refresh();
        $target->refresh();

        $this->assertSame(900.0, (float) $source->balance);
        $this->assertSame(80.0, (float) $target->balance);

        $this->assertDatabaseHas('transactions', [
            'source_type' => 'account_topup',
            'account_debit' => (string) $source->id,
            'amount' => 100.0,
        ]);
        $this->assertDatabaseHas('transactions', [
            'source_type' => 'account_topup',
            'account_credit' => (string) $target->id,
            'amount' => 80.0,
        ]);
    }

    public function test_liability_account_can_be_topped_up_from_external_source(): void
    {
        $this->authorizeAll();

        $target = Account::create([
            'code' => 'INT-ACC-LOAN',
            'name' => 'Loan account',
            'description' => 'Loan account',
            'type' => 'bank',
            'group' => 'Checking',
            'currency' => 'KES',
            'balance' => 0,
            'overdraft_allowed' => false,
            'chart_of_account_id' => ChartOfAccount::where('code', '2000')->value('id'),
        ]);

        $response = $this->postJson('/e-pms/api/v1/accounts/'.$target->id.'/topup', [
            'source_type' => 'external',
            'external_source_description' => 'ABC Bank loan disbursement',
            'amount' => 50000,
        ]);

        $response->assertOk();

        $target->refresh();
        $this->assertSame(50000.0, (float) $target->balance);

        $this->assertDatabaseHas('transactions', [
            'source_type' => 'account_topup_external',
            'account_credit' => (string) $target->id,
            'amount' => 50000.0,
            'account_debit' => null,
        ]);

        // Only the credit leg should exist for external top-ups.
        $this->assertSame(1, Transaction::where('source_id', $target->id)->count());

        $this->assertStringContainsString(
            'ABC Bank loan disbursement',
            (string) Transaction::where('source_type', 'account_topup_external')->value('narration')
        );
    }

    public function test_equity_account_can_be_topped_up_from_external_source(): void
    {
        $this->authorizeAll();

        $target = Account::create([
            'code' => 'INT-ACC-CAP',
            'name' => 'Capital account',
            'description' => 'Capital account',
            'type' => 'bank',
            'group' => 'Checking',
            'currency' => 'KES',
            'balance' => 0,
            'overdraft_allowed' => false,
            'chart_of_account_id' => ChartOfAccount::where('code', '3000')->value('id'),
        ]);

        $response = $this->postJson('/e-pms/api/v1/accounts/'.$target->id.'/topup', [
            'source_type' => 'external',
            'external_source_description' => 'Owner capital injection',
            'amount' => 100000,
        ]);

        $response->assertOk();
        $target->refresh();
        $this->assertSame(100000.0, (float) $target->balance);
        $this->assertDatabaseHas('transactions', [
            'source_type' => 'account_topup_external',
            'account_credit' => (string) $target->id,
        ]);
    }

    public function test_external_topup_is_rejected_for_non_liability_or_equity_accounts(): void
    {
        $this->authorizeAll();

        $target = Account::create([
            'code' => 'INT-ACC-BANK',
            'name' => 'Euro account',
            'description' => 'Euro account',
            'type' => 'bank',
            'group' => 'Checking',
            'currency' => 'EUR',
            'balance' => 0,
            'overdraft_allowed' => false,
            'chart_of_account_id' => ChartOfAccount::where('code', '1000')->value('id'),
        ]);

        $response = $this->postJson('/e-pms/api/v1/accounts/'.$target->id.'/topup', [
            'source_type' => 'external',
            'external_source_description' => 'Cash donation',
            'amount' => 100,
        ]);

        $response->assertStatus(422);
        $target->refresh();
        $this->assertSame(0.0, (float) $target->balance);
        $this->assertDatabaseCount('transactions', 0);
    }

    public function test_external_topup_requires_a_description(): void
    {
        $this->authorizeAll();

        $target = Account::create([
            'code' => 'INT-ACC-LOAN2',
            'name' => 'Loan account',
            'description' => 'Loan account',
            'type' => 'bank',
            'group' => 'Checking',
            'currency' => 'KES',
            'balance' => 0,
            'overdraft_allowed' => false,
            'chart_of_account_id' => ChartOfAccount::where('code', '2000')->value('id'),
        ]);

        $response = $this->postJson('/e-pms/api/v1/accounts/'.$target->id.'/topup', [
            'source_type' => 'external',
            'amount' => 100,
        ]);

        $response->assertStatus(422);
        $this->assertDatabaseCount('transactions', 0);
        $response->assertJsonValidationErrors(['external_source_description']);
    }

    public function test_account_without_chart_of_account_cannot_use_external_topup(): void
    {
        $this->authorizeAll();

        $target = Account::create([
            'code' => 'INT-ACC-NOCOA',
            'name' => 'Plain account',
            'description' => 'Plain account',
            'type' => 'cash',
            'group' => 'Petty',
            'currency' => 'KES',
            'balance' => 0,
            'overdraft_allowed' => false,
            'chart_of_account_id' => null,
        ]);

        $response = $this->postJson('/e-pms/api/v1/accounts/'.$target->id.'/topup', [
            'source_type' => 'external',
            'external_source_description' => 'Mystery money',
            'amount' => 100,
        ]);

        $response->assertStatus(422);
        $this->assertDatabaseCount('transactions', 0);
    }

    private function runStoreRequest(array $payload): \Illuminate\Contracts\Validation\Validator
    {
        // Route the payload through the FormRequest itself so that
        // withValidator() hooks (group/chart cross-validation) execute,
        // exactly like they do in a real HTTP call.
        $request = new \App\Http\Requests\AccountStoreRequest;
        $request->setContainer(app());
        $request->merge($payload);

        $method = new \ReflectionMethod($request, 'getValidatorInstance');

        return $method->invoke($request);
    }

    private function runUpdateRequest(array $payload, Account $account): \Illuminate\Contracts\Validation\Validator
    {
        $request = new \App\Http\Requests\AccountUpdateRequest([], []);
        $request->setContainer(app());
        $request->setRouteResolver(function () use ($account) {
            $route = new \Illuminate\Routing\Route('PUT', 'accounts/{account}', []);
            $route->bind(new \Illuminate\Http\Request);
            $route->setParameter('account', $account);

            return $route;
        });
        $request->merge($payload);

        $method = new \ReflectionMethod($request, 'getValidatorInstance');

        return $method->invoke($request);
    }

    public function test_store_request_requires_chart_of_account(): void
    {
        $validator = $this->runStoreRequest([
            'name' => 'Test',
            'description' => 'Test',
            'type' => 'cash',
            'group' => 'Petty',
            'overdraft_allowed' => 0,
        ]);

        $this->assertTrue($validator->errors()->has('chart_of_account_id'));

        $validator2 = $this->runStoreRequest([
            'name' => 'Test',
            'description' => 'Test',
            'type' => 'cash',
            'group' => 'Petty',
            'overdraft_allowed' => 0,
            'chart_of_account_id' => 999999,
        ]);

        $this->assertTrue($validator2->errors()->has('chart_of_account_id'));
    }

    public function test_chart_of_accounts_endpoints_are_governed_by_account_roles(): void
    {
        // No roles granted for the user: the Account policy must deny access.
        $user = $this->actingAsUserWithRoles([]);

        $response = $this->getJson('/e-pms/api/v1/chart-of-accounts');
        $response->assertForbidden();

        // Granting ROLE_VIEW_ACCOUNT (via the Account policy role base)
        // unlocks the chart of accounts listing.
        $this->actingAsUserWithRoles(['ROLE_VIEW_ACCOUNT']);

        $response = $this->getJson('/e-pms/api/v1/chart-of-accounts');
        $response->assertOk();
        $this->assertCount(
            5,
            array_filter($response->json('data') ?? [], fn () => true)
        );
    }

    public function test_creating_chart_of_account_requires_add_account_role(): void
    {
        $this->actingAsUserWithRoles(['ROLE_VIEW_ACCOUNT']);

        $response = $this->postJson('/e-pms/api/v1/chart-of-accounts', [
            'code' => '6000',
            'name' => 'Other',
        ]);
        $response->assertForbidden();

        $this->actingAsUserWithRoles(['ROLE_VIEW_ACCOUNT', 'ROLE_ADD_ACCOUNT']);

        $response = $this->postJson('/e-pms/api/v1/chart-of-accounts', [
            'code' => '6000',
            'name' => 'Other',
        ]);
        $response->assertCreated();
        $this->assertDatabaseHas('chart_of_accounts', ['code' => '6000']);
    }

    private function actingAsUserWithRoles(array $roleNames): User
    {
        $user = User::create([
            'email' => 'coa-user-'.uniqid().'@example.test',
            'first_name' => 'COA',
            'last_name' => 'Tester',
            'password' => bcrypt('secret123'),
            'category' => 'internal',
            'is_active' => true,
        ]);

        $group = \App\Models\SysGroup::create([
            'name' => 'grp-'.uniqid(),
            'description' => null,
        ]);

        foreach ($roleNames as $roleName) {
            $role = \App\Models\SysRole::where('name', $roleName)->firstOrFail();
            \DB::table('group_roles')->insert([
                'group_id' => $group->id,
                'role_id' => $role->id,
                'is_deleted' => false,
            ]);
        }

        \DB::table('user_groups')->insert([
            'user_id' => $user->id,
            'sys_group_id' => $group->id,
            'is_deleted' => false,
        ]);

        $this->actingAs($user, 'sanctum');

        return $user;
    }

    public function test_loans_group_account_must_link_to_liabilities_or_equity(): void
    {
        $validator = $this->runStoreRequest([
            'name' => 'Loan X',
            'description' => 'Loan X',
            'type' => 'bank',
            'group' => 'Loans',
            'overdraft_allowed' => 0,
            'chart_of_account_id' => ChartOfAccount::where('code', '1000')->value('id'),
        ]);

        $this->assertTrue($validator->fails());
        $this->assertStringContainsString(
            'Liabilities (2000) or Equity (3000)',
            (string) $validator->errors()->first('chart_of_account_id')
        );

        // 2000 is accepted for a Loans account.
        $validatorOk = $this->runStoreRequest([
            'name' => 'Loan X',
            'description' => 'Loan X',
            'type' => 'bank',
            'group' => 'Loans',
            'overdraft_allowed' => 0,
            'chart_of_account_id' => ChartOfAccount::where('code', '2000')->value('id'),
        ]);
        $this->assertTrue($validatorOk->passes());

        // 3000 is accepted for a Loans account.
        $validatorOk2 = $this->runStoreRequest([
            'name' => 'Owner loan',
            'description' => 'Owner loan',
            'type' => 'bank',
            'group' => 'Loans',
            'overdraft_allowed' => 0,
            'chart_of_account_id' => ChartOfAccount::where('code', '3000')->value('id'),
        ]);
        $this->assertTrue($validatorOk2->passes());
    }

    public function test_non_loans_group_can_link_to_any_chart(): void
    {
        $validator = $this->runStoreRequest([
            'name' => 'Cash box',
            'description' => 'Cash box',
            'type' => 'cash',
            'group' => 'Petty',
            'overdraft_allowed' => 0,
            'chart_of_account_id' => ChartOfAccount::where('code', '1000')->value('id'),
        ]);

        $this->assertTrue($validator->passes());
    }

    public function test_loans_validation_on_update_uses_stored_pair(): void
    {
        $loanAccount = Account::create([
            'code' => 'INT-ACC-LOAN-UPD',
            'name' => 'Loan upd',
            'description' => 'Loan upd',
            'type' => 'bank',
            'group' => 'Loans',
            'currency' => 'KES',
            'balance' => 0,
            'overdraft_allowed' => false,
            'chart_of_account_id' => ChartOfAccount::where('code', '2000')->value('id'),
        ]);

        // Trying to flip just the chart to Assets(1000) must fail because the
        // stored group is still Loans.
        $validator = $this->runUpdateRequest(
            ['chart_of_account_id' => ChartOfAccount::where('code', '1000')->value('id')],
            $loanAccount
        );
        $this->assertTrue($validator->fails());

        // Flipping just the group away from Loans is allowed.
        $validator2 = $this->runUpdateRequest(['group' => 'Checking'], $loanAccount);
        $this->assertTrue($validator2->passes());

        // Keeping the valid pair (Loans + Liabilities) is allowed.
        $validator3 = $this->runUpdateRequest(
            ['name' => 'Loan renamed'],
            $loanAccount
        );
        $this->assertTrue($validator3->passes());
    }
}