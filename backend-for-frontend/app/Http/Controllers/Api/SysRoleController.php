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
        $data = $this->service->index($request->all(), $perPage);
        return SysRoleResource::collection($data);
    }

    public function store(SysRoleStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
        return new SysRoleResource($model);
    }

    public function show(SysRole $sysRole)
    {
        $this->authorize('view', $sysRole);

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