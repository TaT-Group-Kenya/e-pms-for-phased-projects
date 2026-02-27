<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return AccountTypeResource::collection($data);
    }

    public function store(AccountTypeStoreRequest $request)
    {
        $validated = $request->validated();
        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);
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

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($accountType->id, $validated);
        return new AccountTypeResource($updated);
    }

    public function destroy(AccountType $accountType)
    {
        $this->authorize('delete', $accountType);

        $this->service->delete($accountType->id);
        return response()->noContent();
    }
}