<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserGroup;
use App\Services\UserGroupService;
use App\Http\Resources\UserGroupResource;
use App\Http\Requests\UserGroupStoreRequest;
use App\Http\Requests\UserGroupUpdateRequest;

class UserGroupController extends Controller
{
    protected $service;

    public function __construct(UserGroupService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\UserGroup::class);
        $perPage = (int) ($request->get('per_page', 15));
        $data = $this->service->index($request->all(), $perPage);
        return UserGroupResource::collection($data);
    }

    public function store(UserGroupStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
        return new UserGroupResource($model);
    }

    public function show(UserGroup $userGroup)
    {
        $this->authorize('view', $userGroup);

        return new UserGroupResource($userGroup);
    }

    public function update(UserGroupUpdateRequest $request, UserGroup $userGroup)
    {
        $this->authorize('update', $userGroup);

        $updated = $this->service->update($userGroup->id, $request->validated());
        return new UserGroupResource($updated);
    }

    public function destroy(UserGroup $userGroup)
    {
        $this->authorize('delete', $userGroup);

        $this->service->delete($userGroup->id);
        return response()->noContent();
    }
}