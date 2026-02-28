<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Account;
use App\Services\AccountService;
use App\Services\CommonService;
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
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page, 0);
        return AccountResource::collection($data);
    }

    public function store(AccountStoreRequest $request)
    {
        $validated = $request->validated();

        // Generate account code in backend using CommonService
        $commonService = new CommonService();
        $validated['code'] = $commonService->generateUniqueCode('INT-ACC-');
        $validated['currency'] = 'KES'; // Accounts run on Base currency

        $model = $this->service->create($validated);
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

        $validated = $request->validated();
        $validated['currency'] = 'KES'; // Accounts run on Base currency

        $updated = $this->service->update($account->id, $validated);
        return new AccountResource($updated);
    }

    public function destroy(Account $account)
    {
        $this->authorize('delete', $account);

        $this->service->delete($account->id);
        return response()->noContent();
    }
}