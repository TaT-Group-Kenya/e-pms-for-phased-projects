<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\GroupRole;
use App\Services\GroupRoleService;
use App\Http\Resources\GroupRoleResource;
use App\Http\Requests\GroupRoleStoreRequest;
use App\Http\Requests\GroupRoleUpdateRequest;

class GroupRoleController extends Controller
{
    protected $service;

    public function __construct(GroupRoleService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\GroupRole::class);
        $perPage = (int) ($request->get('per_page', 15));
        $data = $this->service->index($request->all(), $perPage);
        return GroupRoleResource::collection($data);
    }

    public function store(GroupRoleStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
        return new GroupRoleResource($model);
    }

    public function show(GroupRole $groupRole)
    {
        $this->authorize('view', $groupRole);

        return new GroupRoleResource($groupRole);
    }

    public function update(GroupRoleUpdateRequest $request, GroupRole $groupRole)
    {
        $this->authorize('update', $groupRole);

        $updated = $this->service->update($groupRole->id, $request->validated());
        return new GroupRoleResource($updated);
    }

    public function destroy(GroupRole $groupRole)
    {
        $this->authorize('delete', $groupRole);

        $this->service->delete($groupRole->id);
        return response()->noContent();
    }
}