<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SysGroup;
use App\Services\SysGroupService;
use App\Http\Resources\SysGroupResource;
use App\Http\Requests\SysGroupStoreRequest;
use App\Http\Requests\SysGroupUpdateRequest;

class SysGroupController extends Controller
{
    protected $service;

    public function __construct(SysGroupService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\SysGroup::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page', 'with');

        // Optional eager loading: /sys-groups?with=roles,users
        $with = [];
        if ($request->filled('with')) {
            $with = array_filter(array_map('trim', explode(',', (string) $request->get('with'))));
        }

        $data = $this->service->index($filters, $perPage, $page, 0, $with);
        return SysGroupResource::collection($data);
    }

    public function store(SysGroupStoreRequest $request)
    {
        $this->authorize('create', \App\Models\SysGroup::class);
        $model = $this->service->create($request->validated());
        return new SysGroupResource($model);
    }

    public function show(SysGroup $sysGroup)
    {
        $this->authorize('view', $sysGroup);

        // Always include roles and users for a single group view
        $sysGroup->loadMissing(['roles', 'users']);

        return new SysGroupResource($sysGroup);
    }

    public function update(SysGroupUpdateRequest $request, SysGroup $sysGroup)
    {
        $this->authorize('update', $sysGroup);

        $updated = $this->service->update($sysGroup->id, $request->validated());
        return new SysGroupResource($updated);
    }

    public function destroy(SysGroup $sysGroup)
    {
        $this->authorize('delete', $sysGroup);

        $this->service->delete($sysGroup->id);
        return response()->noContent();
    }
}