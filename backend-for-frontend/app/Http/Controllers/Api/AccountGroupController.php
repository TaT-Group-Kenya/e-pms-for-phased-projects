<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AccountGroupStoreRequest;
use App\Http\Requests\AccountGroupUpdateRequest;
use App\Http\Resources\AccountGroupResource;
use App\Models\AccountGroup;
use App\Services\AccountGroupService;
use Illuminate\Http\Request;

class AccountGroupController extends Controller
{
    protected $service;

    public function __construct(AccountGroupService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', AccountGroup::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);

        return AccountGroupResource::collection($data);
    }

    public function store(AccountGroupStoreRequest $request)
    {
        $this->authorize('create', AccountGroup::class);
        $model = $this->service->create($request->validated());

        return new AccountGroupResource($model);
    }

    public function show(AccountGroup $accountGroup)
    {
        $this->authorize('view', $accountGroup);

        return new AccountGroupResource($accountGroup);
    }

    public function update(AccountGroupUpdateRequest $request, AccountGroup $accountGroup)
    {
        $this->authorize('update', $accountGroup);

        $updated = $this->service->update($accountGroup->id, $request->validated());

        return new AccountGroupResource($updated);
    }

    public function destroy(AccountGroup $accountGroup)
    {
        $this->authorize('delete', $accountGroup);

        $this->service->delete($accountGroup->id);

        return response()->noContent();
    }
}
