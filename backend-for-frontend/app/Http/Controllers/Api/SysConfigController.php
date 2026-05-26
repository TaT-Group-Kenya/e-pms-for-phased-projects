<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
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
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return SysConfigResource::collection($data);
    }

    public function store(SysConfigStoreRequest $request)
    {
        $this->authorize('create', \App\Models\SysConfig::class);
        
        $validated = $request->validated();
        if (($validated['is_file'] ?? false) && $request->hasFile('value')) {
            $file = $request->file('value');
            $publicDirectory = public_path('sys_configs');
            if (!File::exists($publicDirectory)) {
                File::makeDirectory($publicDirectory, 0755, true);
            }
            $filename = uniqid('sysconfig_', true) . '.' . $file->getClientOriginalExtension();
            $file->move($publicDirectory, $filename);
            $validated['value'] = public_path('sys_configs/' . $filename);
        }
        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);
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

        $validated = $request->validated();
        if (($validated['is_file'] ?? false) && $request->hasFile('value')) {
            $file = $request->file('value');
            $publicDirectory = public_path('sys_configs');
            if (!File::exists($publicDirectory)) {
                File::makeDirectory($publicDirectory, 0755, true);
            }
            $filename = uniqid('sysconfig_', true) . '.' . $file->getClientOriginalExtension();
            $file->move($publicDirectory, $filename);
            $validated['value'] = public_path('sys_configs/' . $filename);
        }
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($sysConfig->id, $validated);
        return new SysConfigResource($updated);
    }

    public function destroy(SysConfig $sysConfig)
    {
        if($sysConfig->readonly) {
            return response()->json(['message' => 'This configuration is read-only and cannot be deleted.'], 403);
        }
        $this->authorize('delete', $sysConfig);
        if($sysConfig->is_file && File::exists($sysConfig->value)) {
            File::delete($sysConfig->value);
        }
        $this->service->delete($sysConfig->id);
        return response()->noContent();
    }
}