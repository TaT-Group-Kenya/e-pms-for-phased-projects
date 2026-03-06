<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SysRole;
use App\Services\SysRoleService;
use App\Http\Resources\SysRoleResource;
use App\Http\Requests\SysRoleStoreRequest;
use App\Http\Requests\SysRoleUpdateRequest;

class SysRoleController extends Controller
{
    protected $service;

    public function __construct(SysRoleService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page', 'with');

        // Optional eager loading: /sys-roles?with=groups
        $with = [];
        if ($request->filled('with')) {
            $with = array_filter(array_map('trim', explode(',', (string) $request->get('with'))));
        }

        $data = $this->service->index($filters, $perPage, $page, 0, $with);
        return SysRoleResource::collection($data);
    }

    public function store(SysRoleStoreRequest $request)
    {
        $this->authorize('create', \App\Models\SysRole::class);
        
        $model = $this->service->create($request->validated());
        return new SysRoleResource($model);
    }

    public function show(SysRole $sysRole)
    {
        $this->authorize('view', $sysRole);

        // Include groups that use this role
        $sysRole->loadMissing(['groups']);

        return new SysRoleResource($sysRole);
    }

    public function update(SysRoleUpdateRequest $request, SysRole $sysRole)
    {
        $this->authorize('update', $sysRole);

        $updated = $this->service->update($sysRole->id, $request->validated());
        return new SysRoleResource($updated);
    }

    public function destroy(SysRole $sysRole)
    {
        $this->authorize('delete', $sysRole);

        $this->service->delete($sysRole->id);
        return response()->noContent();
    }
}