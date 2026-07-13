<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\ProjectOwner;
use App\Services\ProjectOwnerService;
use App\Http\Resources\ProjectOwnerResource;
use App\Http\Requests\ProjectOwnerStoreRequest;
use App\Http\Requests\ProjectOwnerUpdateRequest;

class ProjectOwnerController extends Controller
{
    protected $service;

    public function __construct(ProjectOwnerService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\Customer::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return ProjectOwnerResource::collection($data);
    }

    public function store(ProjectOwnerStoreRequest $request)
    {
        $this->authorize('create', \App\Models\Customer::class);
        $validated = $request->validated();
        $validated['created_by'] = Auth::id();
        
        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $filename = time() . '.' . strtolower($file->getClientOriginalExtension());
            $file->storeAs('logos', $filename, 'public');
            $validated['logo'] = $filename;
        }
        
        $model = $this->service->create($validated);
        return new ProjectOwnerResource($model);
    }

    public function show(ProjectOwner $projectOwner)
    {
        $this->authorize('view', \App\Models\Customer::class);

        // Eager load all relationships
        $projectOwner->load([
            'customer',
            'projects',
            'quotations',
            'orders',
            'invoices'
        ]);

        return new ProjectOwnerResource($projectOwner);
    }

    public function update(ProjectOwnerUpdateRequest $request, ProjectOwner $projectOwner)
    {
        $owner = $projectOwner->load([
            'customer',
        ]);
        $this->authorize('update', $owner->customer);

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        
        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $filename = time() . '.' . strtolower($file->getClientOriginalExtension());
            $file->storeAs('logos', $filename, 'public');
            $validated['logo'] = $filename;
        }
        
        $updated = $this->service->update($projectOwner->id, $validated);
        return new ProjectOwnerResource($updated);
    }

    public function destroy(ProjectOwner $projectOwner)
    {
        $owner = $projectOwner->load([
            'customer',
        ]);
        $this->authorize('delete', $owner->customer);

        $this->service->delete($projectOwner->id, Auth::id());
        return response()->noContent();
    }
}
