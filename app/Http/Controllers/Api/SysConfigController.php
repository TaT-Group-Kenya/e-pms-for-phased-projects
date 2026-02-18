<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SysConfig;
use App\Services\SysConfigService;
use App\Http\Resources\SysConfigResource;
use App\Http\Requests\SysConfigStoreRequest;
use App\Http\Requests\SysConfigUpdateRequest;

class SysConfigController extends Controller
{
    protected $service;

    public function __construct(SysConfigService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\SysConfig::class);
        $perPage = (int) ($request->get('per_page', 15));
        $data = $this->service->index($request->all(), $perPage);
        return SysConfigResource::collection($data);
    }

    public function store(SysConfigStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
        return new SysConfigResource($model);
    }

    public function show(SysConfig $sysConfig)
    {
        $this->authorize('view', $sysConfig);

        return new SysConfigResource($sysConfig);
    }

    public function update(SysConfigUpdateRequest $request, SysConfig $sysConfig)
    {
        $this->authorize('update', $sysConfig);

        $updated = $this->service->update($sysConfig->id, $request->validated());
        return new SysConfigResource($updated);
    }

    public function destroy(SysConfig $sysConfig)
    {
        $this->authorize('delete', $sysConfig);

        $this->service->delete($sysConfig->id);
        return response()->noContent();
    }
}