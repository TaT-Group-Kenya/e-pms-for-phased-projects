<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AccountType;
use App\Services\AccountTypeService;
use App\Http\Resources\AccountTypeResource;
use App\Http\Requests\AccountTypeStoreRequest;
use App\Http\Requests\AccountTypeUpdateRequest;

class AccountTypeController extends Controller
{
    protected $service;

    public function __construct(AccountTypeService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\AccountType::class);
        $perPage = (int) ($request->get('per_page', 15));
        $data = $this->service->index($request->all(), $perPage);
        return AccountTypeResource::collection($data);
    }

    public function store(AccountTypeStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
        return new AccountTypeResource($model);
    }

    public function show(AccountType $accountType)
    {
        $this->authorize('view', $accountType);

        return new AccountTypeResource($accountType);
    }

    public function update(AccountTypeUpdateRequest $request, AccountType $accountType)
    {
        $this->authorize('update', $accountType);

        $updated = $this->service->update($accountType->id, $request->validated());
        return new AccountTypeResource($updated);
    }

    public function destroy(AccountType $accountType)
    {
        $this->authorize('delete', $accountType);

        $this->service->delete($accountType->id);
        return response()->noContent();
    }
}