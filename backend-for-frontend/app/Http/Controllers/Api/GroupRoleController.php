<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page', 'with');

        // Optional eager loading: /group-roles?with=group,role
        $with = [];
        if ($request->filled('with')) {
            $with = array_filter(array_map('trim', explode(',', (string) $request->get('with'))));
        }

        $data = $this->service->index($filters, $perPage, $page, 0, $with);
        return GroupRoleResource::collection($data);
    }

    public function store(GroupRoleStoreRequest $request)
    {
        $this->authorize('create', \App\Models\GroupRole::class);
        $validated = $request->validated();
        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);
        return new GroupRoleResource($model);
    }

    public function show(GroupRole $groupRole)
    {
        $this->authorize('view', $groupRole);

        // Include related group and role
        $groupRole->loadMissing(['group', 'role']);

        return new GroupRoleResource($groupRole);
    }

    public function update(GroupRoleUpdateRequest $request, GroupRole $groupRole)
    {
        $this->authorize('update', $groupRole);

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($groupRole->id, $validated);
        return new GroupRoleResource($updated);
    }

    public function destroy(GroupRole $groupRole)
    {
        $this->authorize('delete', $groupRole);

        $this->service->delete($groupRole->id, Auth::id());
        return response()->noContent();
    }
}