<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Account;
use App\Services\AccountService;
use App\Http\Resources\AccountResource;
use App\Http\Requests\AccountStoreRequest;
use App\Http\Requests\AccountUpdateRequest;

class AccountController extends Controller
{
    protected $service;

    public function __construct(AccountService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\Account::class);
        $perPage = (int) ($request->get('per_page', 15));
        $data = $this->service->index($request->all(), $perPage);
        return AccountResource::collection($data);
    }

    public function store(AccountStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
        return new AccountResource($model);
    }

    public function show(Account $account)
    {
        $this->authorize('view', $account);

        return new AccountResource($account);
    }

    public function update(AccountUpdateRequest $request, Account $account)
    {
        $this->authorize('update', $account);

        $updated = $this->service->update($account->id, $request->validated());
        return new AccountResource($updated);
    }

    public function destroy(Account $account)
    {
        $this->authorize('delete', $account);

        $this->service->delete($account->id);
        return response()->noContent();
    }
}