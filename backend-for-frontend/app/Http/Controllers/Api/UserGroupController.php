<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page', 'with');

        // Optional eager loading: /user-groups?with=user,group
        $with = [];
        if ($request->filled('with')) {
            $with = array_filter(array_map('trim', explode(',', (string) $request->get('with'))));
        }

        $data = $this->service->index($filters, $perPage, $page, 0, $with);
        return UserGroupResource::collection($data);
    }

    public function store(UserGroupStoreRequest $request)
    {
        $validated = $request->validated();
        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);
        return new UserGroupResource($model);
    }

    public function show(UserGroup $userGroup)
    {
        $this->authorize('view', $userGroup);

        $userGroup->loadMissing(['user', 'group']);

        return new UserGroupResource($userGroup);
    }

    public function update(UserGroupUpdateRequest $request, UserGroup $userGroup)
    {
        $this->authorize('update', $userGroup);

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($userGroup->id, $validated);
        return new UserGroupResource($updated);
    }

    public function destroy(UserGroup $userGroup)
    {
        $this->authorize('delete', $userGroup);

        $this->service->delete($userGroup->id);
        return response()->noContent();
    }
}